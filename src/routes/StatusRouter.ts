// listsRouter.ts
import BaseRouter from "./baseRouter";
import db from "./db";

class StatusRouter extends BaseRouter {
  configureRoutes(): void {
    this.router.get("/", async (req, res) => {
      try {
        const result = await db.query("SELECT * FROM status");
        res.json(result.rows);
      } catch (error) {
        console.error("Error fetching lists:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
}

export default new StatusRouter().getRouter();
