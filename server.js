import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks.js";
import "./db.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Task Manager API működik!" });
});

app.use("/api/tasks", taskRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Szerverhiba történt." });
});

app.listen(PORT, () => {
  console.log(`Backend fut: http://localhost:${PORT}`);
});
