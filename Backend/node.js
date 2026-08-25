app.use(express.json());

app.post("/api/tasks", (req, res) => {
    const { title, description } = req.body;

    // itt kerül majd az adat MySQL-be

    res.json({
        message: "Feladat létrehozva",
        title,
        description
    });
});