import { Context, Hono } from "hono";
import jwt from "@tsndr/cloudflare-worker-jwt";

const authRoute = new Hono();

authRoute
  .get("/", (c: Context) => {
    return c.json({ message: "Auth service is running!" });
  })
  .post("/login", async (c: Context) => {
    const { email, password }: { email: string; password: string } =
      await c.req.parseBody();

    if (!email || !password) {
      return c.json({
        message: "Email and password are required!",
        status: 400,
      });
    }

    try {
      // Query the database
      const { results } = await c.env.DB.prepare(
        "SELECT * FROM users WHERE email = ? AND password_hash = ? "
      )
        .bind(email, password)
        .all();
      if (!results) {
        return c.json({
          message: "Invalid email or password!",
          status: 401,
        });
      }

      const userData = results[0];

      if (userData.password_hash !== password) {
        return c.json({
          message: "Invalid email or password!",
          status: 401,
        });
      }
      // generate jwt token
      const token = await jwt.sign({ email: email }, c.env.JWT_SECRET);
      // set cookie in the response
      c.header(
        "Set-Cookie",
        `token=${token}; HttpOnly; Max-Age=${
          60 * 60
        };  Path=/; SameSite=None;  Secure; `
      );
      return c.json({ token: token, email: email });
    } catch (error) {
      return c.json({
        message: "Error logging in!",
        status: 500,
      });
    }
  })
  .post("/signup", async (c: Context) => {
    const { email, password } = await c.req.parseBody();
    if (!email || !password) {
      return c.json({
        message: "Email and password are required!",
        status: 400,
      });
    }
    //TODO: Hash the password

    try {
      // Query the database
      const { results } = await c.env.DB.prepare(
        "INSERT INTO users (email, password_hash) VALUES (?, ?)"
      )
        .bind(email, password)
        .all();

      return c.json({ message: "user created" }, 201);
    } catch (error) {
      return c.json({
        message: "Error creating user!",
        status: 500,
      });
    }
  })
  .post("/logout", (c) => {
    c.header(
      "Set-Cookie",
      "token=; HttpOnly; Path=/; SameSite=None; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT;"
    );
    return c.json({ message: "Signout successful!" });
  })
  .post("/reset-password", (c) => {
    return c.json({ message: "Password reset successful!" });
  });
export default authRoute;
