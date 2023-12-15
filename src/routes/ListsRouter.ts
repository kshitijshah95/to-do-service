import BaseRouter from "./baseRouter";
import db from "./db";
import * as uuid from "uuid";

class ListsRouter extends BaseRouter {
  configureRoutes(): void {
    this.router.get("/", async (req, res) => {
      try {
        const result = await db.query("SELECT * FROM lists");
        res.json(result.rows);
      } catch (error) {
        console.error("Error fetching lists:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    this.router.get("/tasks", async (req, res) => {
      try {
        const result = await db.query(`
          SELECT 
          lists.id, lists.name, tasks.id AS task_id, tasks.name AS task_name, tasks.status_id, status.status_cd 
          FROM lists 
          LEFT JOIN tasks ON lists.id = tasks.list_id
          INNER JOIN status ON tasks.status_id = status.id;
        `);

        console.log("Result: ", result.rows);

        const listsWithTasks: any = {};

        result.rows.forEach((row) => {
          const listId = row.id;
          if (!listsWithTasks[listId]) {
            listsWithTasks[listId] = {
              list_id: listId,
              list_name: row.name,
              tasks: [],
            };
          }

          if (row.task_id) {
            listsWithTasks[listId].tasks.push({
              task_id: row.task_id,
              task_name: row.task_name,
              status: row.status_cd,
            });
          }
        });
        const response = Object.values(listsWithTasks);

        res.json(response);
      } catch (error) {
        console.error("Error executing query", error);
        res.status(500).send("Internal Server Error");
      }
    });

    this.router.post("/", async (req, res) => {
      try {
        const { body } = req;
        const { id, name, description, created_at, last_updated_at } = body;
        const result = await db.query(
          `INSERT INTO lists (
            id, name, description, created_at, last_updated_at
          ) VALUES (
            $1, $2, $3, $4, $5
          ) RETURNING *`,
          [uuid.v4(), name, description, created_at, last_updated_at]
        );
        res.json(result.rows);
      } catch (error) {
        console.error("Error fetching lists:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
}

export default new ListsRouter().getRouter();
