import express from "express";

import {
  deleteUser,
  listUsers,
  updateUserRole
} from "../controller/user.controller.js";
import auth from "../middleware/auth.middleware.js";
import allowRoles from "../middleware/role.middleware.js";
import validate from "../middleware/validation.middleware.js";
import {
  updateUserRoleValidation,
  userIdValidation
} from "../validators/user.validator.js";

const router = express.Router();

router.use(auth);
router.use(allowRoles("ADMIN"));

router.get(
  "/",
  listUsers
);

router.patch(
  "/:id/role",
  userIdValidation,
  updateUserRoleValidation,
  validate,
  updateUserRole
);

router.delete(
  "/:id",
  userIdValidation,
  validate,
  deleteUser
);

export default router;
