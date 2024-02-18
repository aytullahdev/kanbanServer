import { Hono } from "hono";
import authRoute from "./routes/auth";
import boardRoute from "./routes/board";
import isValidUser from "./middlewares/isValidUser";

const app = new Hono();

// Middleware to check if the user is valid
app.use("/board/*", isValidUser);

// Routes
app.route("/auth", authRoute);
app.route("/board", boardRoute);

export default app;
