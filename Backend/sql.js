import mysql from "mysql2";

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "task_manager"
});

db.connect((err) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log("MySQL kapcsolódva!");
});