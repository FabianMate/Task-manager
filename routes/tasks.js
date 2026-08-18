import { Router } from "express";
import db from "../db.js";

const router = Router();

const validStatuses = ["todo", "in_progress", "done"];

// GET /api/tasks
router.get("/", (req, res) => {
  const { status } = req.query;

  let sql = "SELECT * FROM tasks";
  const params = [];

  if (status) {
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Érvénytelen státusz." });
    }
    sql += " WHERE status = ?";
    params.push(status);
  }

  sql += " ORDER BY id DESC";

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: "Adatbázis hiba." });
    res.json(rows);
  });
});

// GET /api/tasks/:id
router.get("/:id", (req, res) => {
  db.get(
    "SELECT * FROM tasks WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json({ error: "Adatbázis hiba." });
      if (!row) return res.status(404).json({ error: "A feladat nem található." });
      res.json(row);
    }
  );
});

// POST /api/tasks
router.post("/", (req, res) => {
  const { title, description = "", status = "todo", due_date = null } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "A cím nem lehet üres." });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Érvénytelen státusz." });
  }

  db.run(
    `INSERT INTO tasks (title, description, status, due_date)
     VALUES (?, ?, ?, ?)`,
    [title.trim(), description, status, due_date],
    function (err) {
      if (err) return res.status(500).json({ error: "Adatbázis hiba." });

      db.get(
        "SELECT * FROM tasks WHERE id = ?",
        [this.lastID],
        (err, row) => {
          if (err) return res.status(500).json({ error: "Adatbázis hiba." });
          res.status(201).json(row);
        }
      );
    }
  );
});

// PUT /api/tasks/:id
router.put("/:id", (req, res) => {
  const { title, description = "", status, due_date = null } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "A cím nem lehet üres." });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Érvénytelen státusz." });
  }

  db.run(
    `UPDATE tasks
     SET title = ?, description = ?, status = ?, due_date = ?
     WHERE id = ?`,
    [title.trim(), description, status, due_date, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: "Adatbázis hiba." });
      if (this.changes === 0) {
        return res.status(404).json({ error: "A feladat nem található." });
      }

      db.get(
        "SELECT * FROM tasks WHERE id = ?",
        [req.params.id],
        (err, row) => {
          if (err) return res.status(500).json({ error: "Adatbázis hiba." });
          res.json(row);
        }
      );
    }
  );
});

// DELETE /api/tasks/:id
router.delete("/:id", (req, res) => {
  db.run(
    "DELETE FROM tasks WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: "Adatbázis hiba." });
      if (this.changes === 0) {
        return res.status(404).json({ error: "A feladat nem található." });
      }

      res.json({ message: "A feladat törölve." });
    }
  );
});

export default router;
