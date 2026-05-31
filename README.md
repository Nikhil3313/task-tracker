# Team Task Tracker API

REST API for organization-based task tracking with JWT authentication, role-based access control, Redis caching, MongoDB persistence, and Docker Compose deployment.

## Setup

```bash
docker compose up --build
```

The API starts on:

```txt
http://localhost:5000
```

Useful endpoints:

```txt
GET /                 health check
GET /api-docs         Swagger UI
```

No manual MongoDB or Redis setup is required. Docker Compose starts the API, MongoDB, and Redis together.

## Environment

The compose setup uses `.env.example` by default:

```env
PORT=5000
MONGO_URI=mongodb://mongo:27017/task_tracker
JWT_SECRET=change_me_access_secret
REFRESH_SECRET=change_me_refresh_secret
REDIS_URL=redis://redis:6379
```

## Authentication and Roles

The API supports `ADMIN`, `MANAGER`, and `MEMBER`.

- `ADMIN`: manage users and tasks within the organization
- `MANAGER`: manage tasks and assign members
- `MEMBER`: view assigned tasks and update assigned task status

Access control is enforced in middleware before controllers run. Task reads and mutations are scoped by organization, and members are restricted to their own assigned tasks.

## Task Status Transitions

Status changes are validated server-side:

```txt
TODO -> IN_PROGRESS -> IN_REVIEW -> DONE
TODO -> BLOCKED
IN_PROGRESS -> BLOCKED
IN_REVIEW -> BLOCKED
```

Only the assignee, an admin, or a manager can update a task's status.

## Caching Strategy

Redis caches task list responses for 60 seconds. Cache keys include organization, assignee, filters, and pagination:

```txt
tasks:{organizationId}:assignee={assigneeId}:status={status}:priority={priority}:page={page}:limit={limit}
```

Members always list tasks using their own user id as the assignee scope. Admins and managers can list by assignee, status, and priority. This keeps repeated dashboard/list views fast while keeping data isolated by organization.

## Cache Invalidation

Any task mutation invalidates task-list cache entries for that organization:

- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `DELETE /api/tasks/:id`

Invalidation scans and deletes keys matching:

```txt
tasks:{organizationId}:*
```

That approach favors correctness: after a write, all affected task-list views for the organization are refreshed on the next read.

## Database Design

Main collections:

```txt
organizations
  _id
  name

users
  _id
  name
  email
  password
  role
  organization -> organizations._id

tasks
  _id
  title
  description
  priority
  status
  assignee -> users._id
  organization -> organizations._id
  due_date

refresh_tokens
  _id
  userId -> users._id
  token
```

Tasks store both `organization` and `assignee`. Keeping `organization` directly on each task makes organization-scoped queries simple and secure without joining through the assignee. The task model also has indexes on `status`, `assignee`, and `due_date` because those fields are used for filtering task lists and operational views.

## Error Format

Errors use a consistent shape:

```json
{
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "due_date must be a future date"
}
```

## API Documentation

Swagger/OpenAPI documentation is available at:

```txt
http://localhost:5000/api-docs
```

The raw spec is in `openapi.yaml`.

## Given More Time

I would add integration tests for login/refresh-token rotation, member task scoping, task status transitions, and Redis invalidation. I would also add project-level APIs, logout/token revocation, rate limiting, request logging correlation ids, and a small analytics endpoint for overdue tasks by assignee.
