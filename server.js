import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Task Manager Backend működik!"
    });
});

app.use("/api/tasks", taskRoutes);

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: "Szerverhiba történt."
    });
});

app.listen(PORT, () => {
    console.log(`Backend fut: http://localhost:${PORT}`);
});
