import {
  body,
  param,
  query
} from "express-validator";

const priorities = [
  "LOW",
  "MEDIUM",
  "HIGH"
];

const statuses = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
  "BLOCKED"
];

const isFutureDate = (value) => {
  if (!value) {
    return true;
  }

  return new Date(value).getTime() > Date.now();
};

export const taskIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Task id must be valid")
];

export const listTasksValidation = [
  query("page")
    .optional()
    .isInt({
      min: 1
    })
    .withMessage("page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({
      min: 1,
      max: 100
    })
    .withMessage("limit must be between 1 and 100"),

  query("status")
    .optional()
    .isIn(statuses)
    .withMessage("status must be a valid task status"),

  query("priority")
    .optional()
    .isIn(priorities)
    .withMessage("priority must be LOW, MEDIUM or HIGH"),

  query("assignee")
    .optional()
    .isMongoId()
    .withMessage("assignee must be a valid user id")
];

export const createTaskValidation = [

  body("title")
    .notEmpty()
    .withMessage(
      "Title is required"
    ),

  body("priority")
    .optional()
    .isIn(priorities)
    .withMessage(
      "Priority must be LOW, MEDIUM or HIGH"
    ),

  body("assignee")
    .optional()
    .isMongoId()
    .withMessage("assignee must be a valid user id"),

  body("due_date")
    .optional()
    .isISO8601()
    .withMessage(
      "Invalid due date format"
    )
    .bail()
    .custom(isFutureDate)
    .withMessage("due_date must be a future date")

];

export const updateTaskValidation = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title cannot be empty"),

  body("priority")
    .optional()
    .isIn(priorities)
    .withMessage("Priority must be LOW, MEDIUM or HIGH"),

  body("status")
    .not()
    .exists()
    .withMessage("Use PATCH /api/tasks/:id/status to change status"),

  body("assignee")
    .optional()
    .isMongoId()
    .withMessage("assignee must be a valid user id"),

  body("due_date")
    .optional()
    .isISO8601()
    .withMessage("Invalid due date format")
    .bail()
    .custom(isFutureDate)
    .withMessage("due_date must be a future date")
];

export const updateTaskStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage("status is required")
    .bail()
    .isIn(statuses)
    .withMessage("status must be a valid task status")
];
