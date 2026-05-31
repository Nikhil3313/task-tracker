import { body } from "express-validator";

export const registerValidation = [

  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage(
      "Password must be at least 6 characters"
    ),

  body("role")
    .optional()
    .isIn([
      "ADMIN",
      "MANAGER",
      "MEMBER"
    ])
    .withMessage(
      "Role must be ADMIN, MANAGER or MEMBER"
    ),

  body("organizationName")
    .notEmpty()
    .withMessage(
      "Organization name is required"
    )

];

export const loginValidation = [

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage(
      "Password is required"
    )

];

export const refreshValidation = [
  body("refreshToken")
    .notEmpty()
    .withMessage("refreshToken is required")
];
