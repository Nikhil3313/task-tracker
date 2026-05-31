import express from "express";

import {
  register,
  login,
  refresh
} from "../controller/auth.controller.js";

import {
  registerValidation,
  loginValidation,
  refreshValidation
} from "../validators/auth.validator.js";

import validate
from "../middleware/validation.middleware.js";

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  validate,
  register
);

router.post(
  "/login",
  loginValidation,
  validate,
  login
);

router.post(
  "/refresh",
  refreshValidation,
  validate,
  refresh
);

export default router;
