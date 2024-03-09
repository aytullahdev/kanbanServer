import { Hono } from "hono";
import authRoute from "./routes/auth";
import boardRoute from "./routes/board";
import isValidUser from "./middlewares/isValidUser";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://kanban-board-dusky-one.vercel.app",
    ],
    allowMethods: ["POST", "PUT", "DELETE", "GET", "PATCH", "OPTIONS"],
    maxAge: 600,
    credentials: true,
  })
);
// Middleware to check if the user is valid

app.use("/board/*", isValidUser);

// Routes
app.route("/auth", authRoute);
app.route("/board", boardRoute);

export default app;
