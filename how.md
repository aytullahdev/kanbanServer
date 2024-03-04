
Here's a breakdown of your questions in Markdown format suitable for GitHub markdown files:


### 1) How to set Cookie Header?

```javascript
c.header("Set-Cookie", `token=${token}; HttpOnly; Path=/; Secure;`);
```

### 2) How to receive Cookie From Header?

```javascript
const token = getCookie(c, "token");
```

### 3) How to Implement IsValidUser Middleware?

```javascript
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
```

### 4) How to connect Database?

```javascript
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
```

### 5) How to get the env variable?

```javascript
c.env.JWT_SECRET
```

### 6) How to handle Preflight CORS error?

```javascript
app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["POST", "PUT", "DELETE", "GET", "PATCH", "OPTIONS"],
    maxAge: 600,
    credentials: true,
  })
);
```
