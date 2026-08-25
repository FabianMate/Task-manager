import { Router } from "express";
import db from "../db.js";

const router = Router();

const validStatuses = [
    "TODO",
    "IN_PROGRESS",
    "DONE"
];

const validPriorities = [
    "LOW",
    "MEDIUM",
    "HIGH"
];


// GET - összes feladat
router.get("/", async (req, res, next) => {
    try {
        const { status, priority } = req.query;

        let sql = "SELECT * FROM tasks WHERE 1=1";
        const params = [];

        if (status) {
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    error: "Érvénytelen státusz."
                });
            }

            sql += " AND status = ?";
            params.push(status);
        }

        if (priority) {
            if (!validPriorities.includes(priority)) {
                return res.status(400).json({
                    error: "Érvénytelen prioritás."
                });
            }

            sql += " AND priority = ?";
            params.push(priority);
        }

        sql += " ORDER BY id DESC";

        const [tasks] = await db.query(sql, params);

        res.json(tasks);

    } catch (error) {
        next(error);
    }
});


// GET - egy feladat
router.get("/:id", async (req, res, next) => {
    try {
        const [tasks] = await db.query(
            "SELECT * FROM tasks WHERE id = ?",
            [req.params.id]
        );

        if (tasks.length === 0) {
            return res.status(404).json({
                error: "A feladat nem található."
            });
        }

        res.json(tasks[0]);

    } catch (error) {
        next(error);
    }
});


// POST - új feladat
router.post("/", async (req, res, next) => {
    try {
        const {
            title,
            description = "",
            status = "TODO",
            priority = "MEDIUM",
            due_date = null
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                error: "A cím nem lehet üres."
            });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: "Érvénytelen státusz."
            });
        }

        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                error: "Érvénytelen prioritás."
            });
        }

        const [result] = await db.query(
            `INSERT INTO tasks
            (title, description, status, priority, due_date)
            VALUES (?, ?, ?, ?, ?)`,
            [
                title.trim(),
                description,
                status,
                priority,
                due_date
            ]
        );

        const [tasks] = await db.query(
            "SELECT * FROM tasks WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json(tasks[0]);

    } catch (error) {
        next(error);
    }
});


// PUT - feladat módosítása
router.put("/:id", async (req, res, next) => {
    try {
        const {
            title,
            description = "",
            status,
            priority,
            due_date = null
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                error: "A cím nem lehet üres."
            });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: "Érvénytelen státusz."
            });
        }

        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                error: "Érvénytelen prioritás."
            });
        }

        const [result] = await db.query(
            `UPDATE tasks
             SET title = ?,
                 description = ?,
                 status = ?,
                 priority = ?,
                 due_date = ?
             WHERE id = ?`,
            [
                title.trim(),
                description,
                status,
                priority,
                due_date,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "A feladat nem található."
            });
        }

        const [tasks] = await db.query(
            "SELECT * FROM tasks WHERE id = ?",
            [req.params.id]
        );

        res.json(tasks[0]);

    } catch (error) {
        next(error);
    }
});


// DELETE - feladat törlése
router.delete("/:id", async (req, res, next) => {
    try {
        const [result] = await db.query(
            "DELETE FROM tasks WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "A feladat nem található."
            });
        }

        res.json({
            message: "A feladat sikeresen törölve."
        });

    } catch (error) {
        next(error);
    }
});


export default router;