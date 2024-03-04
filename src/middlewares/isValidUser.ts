import jwt from "@tsndr/cloudflare-worker-jwt";
import { Next } from "hono";
import { getCookie } from "hono/cookie";
// Define a type or interface for your payload
interface MyPayload {
  email: string;
}
export default async function isValidUser(c: any, next: Next) {
  try {
    const token = getCookie(c, "token");
    if (!token) {
      return c.json({ message: "Invalid user!" }, 401);
    }
    const isValid = await jwt.verify(token, c.env.JWT_SECRET);
    if (!isValid) {
      return c.json({ message: "Invalid user!" }, 401);
    }

    const { payload } = jwt.decode<MyPayload>(token);

    if (!payload?.email) {
      return c.json({ message: "Invalid user!" }, 401);
    }

    c.set("user", payload.email);
    await next();
  } catch (error) {
    return c.json({ message: "Invalid user!" }, 401);
  }
}
