import { Hono } from "hono";
import connectToDatabase from "../controllers/databaseConnection";
import { QueryResultRow } from "pg";

const boardRoute = new Hono();

boardRoute
  .get("/", async (c: any) => {
    const email = c.get("user");

    // Connect to the database
    const client = await connectToDatabase(c);
    const query = "SELECT * FROM tasks WHERE user_email = $1";
    const values = [email];
    try {
      const result = await client.query(query, values);
      return c.json({ tasks: result.rows });
    } catch (error) {
      return c.json({
        message: "Error fetching tasks!",
        status: 500,
      });
    }
  })
  .post("/", async (c: any) => {
    const email = c.get("user");
    const { title, status }: { title: string; status: string } =
      await c.req.parseBody();

    if (!title || !status) {
      return c.json({
        message: "Title and column are required!",
        status: 400,
      });
    }
    // Connect to the database
    const client = await connectToDatabase(c);
    const query =
      "INSERT INTO tasks (title, status, user_email) VALUES ($1, $2, $3)";

    const values = [title, status, email];
    try {
      const result: QueryResultRow = await client.query(query, values);
      return c.json({ message: "Task created!", status: 201 });
    } catch (error) {
      console.log(error);
      return c.json({
        message: "Error creating tasks!",
        status: 500,
      });
    }
  })
  .put("/", async (c: any) => {
    const email = c.get("user");
    const {
      title,
      status,
      task_id,
    }: { title: string; status: string; task_id: number } =
      await c.req.parseBody();

    if (!title || !status || !task_id) {
      return c.json({
        message: "Title and column are required!",
        status: 400,
      });
    }
    // Connect to the database
    const client = await connectToDatabase(c);
    const query =
      "UPDATE tasks SET status = $1, title = $2 WHERE task_id = $3 AND user_email = $4";

    const values = [status, title, task_id, email];
    try {
      const result: QueryResultRow = await client.query(query, values);
      return c.json({ message: "Task updated!", status: 200 });
    } catch (error) {
      console.log(error);
      return c.json({
        message: "Error creating tasks!",
        status: 500,
      });
    }
  })
  .delete("/", async (c: any) => {
    const email = c.get("user");
    const { task_id }: { task_id: number } = await c.req.parseBody();

    if (!task_id) {
      return c.json({
        message: "Task ID is required!",
        status: 400,
      });
    }

    // Connect to the database
    const client = await connectToDatabase(c);
    const query = "DELETE FROM tasks WHERE task_id = $1 AND user_email = $2";

    const values = [task_id, email];
    try {
      const result: QueryResultRow = await client.query(query, values);

      return c.json({ message: "Task deleted!", status: 200 });
    } catch (error) {
      console.log(error);
      return c.json({
        message: "Error deleteting task!",
        status: 500,
      });
    }
  });

export default boardRoute;
