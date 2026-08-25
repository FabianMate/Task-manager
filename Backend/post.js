app.post("/api/tasks", (req, res) => {
    const { title, description } = req.body;

    const sql = `
        INSERT INTO tasks (title, description)
        VALUES (?, ?)
    `;

    db.query(sql, [title, description], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: "Adatbázis hiba"
            });
        }

        res.json({
            message: "Feladat létrehozva",
            id: result.insertId
        });
    });
});