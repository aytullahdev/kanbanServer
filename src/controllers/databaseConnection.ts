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
