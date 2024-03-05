import { Context, Hono } from "hono";
import connectToDatabase from "../controllers/databaseConnection";
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
    const client = await connectToDatabase(c);

    const query =
      "SELECT * FROM users WHERE email = $1 AND password_hash = $2 ";

    const values = [email, password];

    try {
      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        return c.json({
          message: "Invalid email or password!",
          status: 401,
        });
      }
      // generate jwt token
      const token = await jwt.sign({ email: email }, c.env.JWT_SECRET);
      // set cookie in the response
      c.header("Set-Cookie", `token=${token}; HttpOnly; Path=/; Secure;`);
      return c.json({ token: token, email: email });
    } catch (error) {
      return c.json({
        message: "Error logging in!",
        status: 500,
      });
    }
  })
  .post("/signup", async (c) => {
    const { email, password } = await c.req.parseBody();
    if (!email || !password) {
      return c.json({
        message: "Email and password are required!",
        status: 400,
      });
    }
    //TODO: Hash the password
    const client = await connectToDatabase(c);
    const query =
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *";
    const values = [email, password];
    try {
      const result = await client.query(query, values);
      return c.json(result, 201);
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
      "token=; HttpOnly; Path=/; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT;"
    );
    return c.json({ message: "Signout successful!" });
  })
  .post("/reset-password", (c) => {
    return c.json({ message: "Password reset successful!" });
  });
export default authRoute;
