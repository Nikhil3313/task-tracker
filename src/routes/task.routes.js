import express from "express";

import auth from "../middleware/auth.middleware.js";

import allowRoles from "../middleware/role.middleware.js";
import {
  scopeTaskList,
  loadTask,
  allowTaskManagement,
  allowTaskRead,
  allowStatusUpdate
} from "../middleware/task-access.middleware.js";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus
} from "../controller/task.controller.js";
import {
  createTaskValidation,
  updateTaskValidation,
  updateTaskStatusValidation,
  listTasksValidation,
  taskIdValidation
} from "../validators/task.validator.js";
import validate from "../middleware/validation.middleware.js";


const router = express.Router();

router.get(
  "/",
  auth,
  listTasksValidation,
  validate,
  scopeTaskList,
  getTasks
);

router.post(
  "/",
  auth,
  allowRoles(
    "ADMIN",
    "MANAGER"
  ),
  createTaskValidation,
  validate,
  createTask
);

router.get(
 "/:id",
 auth,
 taskIdValidation,
 validate,
 loadTask,
 allowTaskRead,
 getTaskById
);

router.put(
  "/:id",
  auth,
  taskIdValidation,
  updateTaskValidation,
  validate,
  loadTask,
  allowTaskManagement,
  updateTask
);

router.delete(
  "/:id",
  auth,
  taskIdValidation,
  validate,
  loadTask,
  allowTaskManagement,
  deleteTask
);

router.patch(
  "/:id/status",
  auth,
  taskIdValidation,
  updateTaskStatusValidation,
  validate,
  loadTask,
  allowStatusUpdate,
  updateTaskStatus
);

export default router;
