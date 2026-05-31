import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

import auth from "./middleware/auth.middleware.js";
import errorHandler from "./middleware/error.middleware.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();
const swaggerDocument = YAML.load("./openapi.yaml");

/*
|--------------------------------------------------------------------------
| Global Middlewares
|--------------------------------------------------------------------------
*/

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

/*
|--------------------------------------------------------------------------
| Health Check Route
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Team Task Tracker API Running"
  });
});

/*
|--------------------------------------------------------------------------
| Temporary Protected Route
|--------------------------------------------------------------------------
| Used only for JWT testing
*/

app.get(
  "/private",
  auth,
  (req, res) => {
    res.status(200).json({
      success: true,
      user: req.user
    });
  }
);

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use("/api/tasks", taskRoutes);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

/*
|--------------------------------------------------------------------------
| Error Handler (Must be last)
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

export default app;
