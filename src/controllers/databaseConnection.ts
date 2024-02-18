import { Client } from "pg";
const connectToDatabase = async () => {
  const client = new Client(
    "postgres://kanbanboard_user:AmIzK4WEdMS0IH0IvjjncOOfOxCzOgHq@dpg-cn8uqmi1hbls73dd8dl0-a.oregon-postgres.render.com/kanbanboard?ssl=true"
  );

  await client.connect();
  return client;
};

export default connectToDatabase;
