import Task from "../models/Task.js";

const forbidden = (res, message = "Permission denied") => {
  return res.status(403).json({
    status: 403,
    code: "FORBIDDEN",
    message
  });
};

const isManagerLevel = (user) => {
  return [
    "ADMIN",
    "MANAGER"
  ].includes(user.role);
};

const isAssignee = (task, user) => {
  return task.assignee?.toString() === user.id;
};

export const scopeTaskList = (req, res, next) => {
  const query = {
    organization: req.user.organization
  };

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.priority) {
    query.priority = req.query.priority;
  }

  if (req.user.role === "MEMBER") {
    query.assignee = req.user.id;
  } else if (req.query.assignee) {
    query.assignee = req.query.assignee;
  }

  req.taskQuery = query;
  next();
};

export const loadTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      organization: req.user.organization
    });

    if (!task) {
      return res.status(404).json({
        status: 404,
        code: "NOT_FOUND",
        message: "Task not found"
      });
    }

    req.task = task;
    next();
  } catch (error) {
    next(error);
  }
};

export const allowTaskRead = (req, res, next) => {
  if (isManagerLevel(req.user) || isAssignee(req.task, req.user)) {
    return next();
  }

  return forbidden(res);
};

export const allowTaskManagement = (req, res, next) => {
  if (isManagerLevel(req.user)) {
    return next();
  }

  return forbidden(res, "Only admins and managers can manage tasks");
};

export const allowStatusUpdate = (req, res, next) => {
  if (isManagerLevel(req.user) || isAssignee(req.task, req.user)) {
    return next();
  }

  return forbidden(
    res,
    "Only the assignee, admin or manager can update status"
  );
};
