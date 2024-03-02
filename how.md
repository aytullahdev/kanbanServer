1) How to set Cookie Header?
    c.header("Set-Cookie", `token=${token}; HttpOnly; Path=/; Secure;`);
   
3) How to recive Cookie From Header?
    const token = getCookie(c, "token");
   
4) How to Impliment IsValiduser MiddleWare?

interface MyPayload {
  email: string;
}
export default async function isValidUser(c: any, next: Next) {
  if (c.req.method === "OPTIONS") {
    next();
  }
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

export default async function isValidUser(c: any, next: Next) {
  
  if (c.req.method === "OPTIONS") {
    next();
  }
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

5) How to connect Database?

import { Context } from "hono";
import { Client } from "pg";
const connectToDatabase = async (c: Context) => {
  try {
    const client = new Client(c.env.DB_URL);
    await client.connect();
    return client;
  } catch (error) {
    throw new Error("Error connecting to the database!");
  }
};

export default connectToDatabase;

6) How to get the env variable?
   c.env.JWT_SECRET

7) How I handle Priflight CORS error?
   if (c.req.method === "OPTIONS") {
    next();

  }
  # Also Use cors
  
  import { cors } from "hono/cors";
  app.use(cors());
