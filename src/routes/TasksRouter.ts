import BaseRouter from "./baseRouter";
import db from "./db";
import * as uuid from "uuid";

class TasksRouter extends BaseRouter {
  configureRoutes(): void {
    this.router.get("/", async (req, res) => {
      try {
        const result = await db.query("SELECT * FROM tasks");
        res.json(result.rows);
      } catch (error) {
        console.error("Error fetching lists:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    this.router.post("/", async (req, res) => {
      try {
        const { body } = req;
        const {
          name,
          description,
          created_at,
          last_updated_at,
          list_id,
          status_id,
        } = body;
        const result = await db.query(
          `INSERT INTO tasks (
            id, name, description, list_id, status_id, created_at, last_updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7
          ) RETURNING *`,
          [
            uuid.v4(),
            name,
            description,
            list_id,
            status_id,
            created_at,
            last_updated_at,
          ]
        );
        res.json(result.rows);
      } catch (error) {
        console.error("Error fetching lists:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    this.router.put("/:taskId", async (req, res) => {
      try {
        const taskId = req.params.taskId;
        const { name, description, last_updated_at, list_id, status } =
          req.body;
        const result = await db.query(
          `UPDATE tasks 
          SET name=$1, description=$2, list_id=$3, status_id=(SELECT id FROM status WHERE status_cd=$4), last_updated_at=$5
          WHERE id=$6 RETURNING *`,
          [name, description, list_id, status, last_updated_at, taskId]
        );
        res.json(result.rows);
      } catch (error) {
        console.error("Error fetching lists:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    this.router.delete("/:taskId", async (req, res) => {
      try {
        const taskId = req.params.taskId;
        const result = await db.query(`DELETE FROM tasks where id=$1`, [
          taskId,
        ]);
        res.json(result.rows);
      } catch (error) {
        console.error("Error fetching lists:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
}

export default new TasksRouter().getRouter();
