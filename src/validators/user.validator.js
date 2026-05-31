import {
  body,
  param
} from "express-validator";

export const userIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("User id must be valid")
];

export const updateUserRoleValidation = [
  body("role")
    .isIn([
      "ADMIN",
      "MANAGER",
      "MEMBER"
    ])
    .withMessage("Role must be ADMIN, MANAGER or MEMBER")
];
