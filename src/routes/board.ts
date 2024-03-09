import { Hono } from "hono";

const boardRoute = new Hono();

boardRoute
  .get("/", async (c: any) => {
    const email = c.get("user");

    try {
      // Query the database
      const { results } = await c.env.DB.prepare(
        "SELECT * FROM tasks WHERE user_email = ? "
      )
        .bind(email)
        .all();
      return c.json({ tasks: results });
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

    try {
      // Query the database
      const { results } = await c.env.DB.prepare(
        "INSERT INTO tasks (title, status, user_email) VALUES (?, ?, ?) "
      )
        .bind(title, status, email)
        .all();
      return c.json({ message: "Task created!", status: 201 });
    } catch (error) {
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

    try {
      // Query the database
      const { results } = await c.env.DB.prepare(
        "UPDATE tasks SET status = ?, title = ? WHERE task_id = ? AND user_email = ?"
      )
        .bind(status, title, task_id, email)
        .all();

      return c.json({ message: "Task updated!", status: 200 });
    } catch (error) {
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

    try {
      // Query the database
      const { results } = await c.env.DB.prepare(
        "DELETE FROM tasks WHERE task_id = ? AND user_email = ?"
      )
        .bind(task_id, email)
        .all();
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
