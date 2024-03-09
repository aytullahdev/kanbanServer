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
### 7) How to connect D1 database.

```javascript
pnpm wrangler d1 create kanbanboard # Create the database

# Add binding to wrangler.toml file
[[d1_databases]]
binding = "DB" # available in your Worker on env.DB
database_name = "prod-d1-tutorial"
database_id = "<unique-ID-for-your-database>"

# Create a schema.sql file 
DROP TABLE IF EXISTS Customers;
CREATE TABLE IF NOT EXISTS Customers (CustomerId INTEGER PRIMARY KEY, CompanyName TEXT, ContactName TEXT);
INSERT INTO Customers (CustomerID, CompanyName, ContactName) VALUES (1, 'Alfreds Futterkiste', 'Maria Anders'), (4, 'Around the Horn', 'Thomas Hardy'), (11, 'Bs Beverages', 'Victoria Ashworth'), (13, 'Bs Beverages', 'Random Name');

# Run schema localy
pnpm wrangler d1 execute  kanbanboard --local --file=./src/schema/schema.sql
 
# Validate data
npx wrangler d1 execute kanbanboard --local --command="SELECT * FROM Customers"
```
<img width="904" alt="Screenshot 2024-03-09 at 9 23 18 PM" src="https://github.com/aytullahdev/kanbanServer/assets/139336931/bd4f9ded-a731-43d6-bbc2-3794e215444c">
