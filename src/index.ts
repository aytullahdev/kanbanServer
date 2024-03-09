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

export interface Env {
  // If you set another name in wrangler.toml as the value for 'binding',
  // replace "DB" with the variable name you defined.
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/beverages") {
      // If you did not use `DB` as your binding name, change it here
      const { results } = await env.DB.prepare(
        "SELECT * FROM Customers WHERE CompanyName = ?"
      )
        .bind("Bs Beverages")
        .all();
      return Response.json(results);
    }

    return new Response(
      "Call /api/beverages to see everyone who works at Bs Beverages"
    );
  },
};
