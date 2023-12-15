import express from "express";
import dotenv from "dotenv";
import ListsRouter from "./routes/ListsRouter";
import StatusRouter from "././routes/StatusRouter";
import TasksRouter from "./routes/TasksRouter";
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Use the modularized routers
app.use("/lists", ListsRouter);
app.use("/status", StatusRouter);
app.use("/tasks", TasksRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
