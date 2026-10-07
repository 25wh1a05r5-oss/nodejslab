const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

app.use(express.json());

const db = mysql.createPool({
    host: "localhost",
    user: "studentapp",
    password: "1234",
    database: "StudentDB"
});

db.getConnection()
    .then(connection => {
        console.log("MySQL connected");
        connection.release();
    })
    .catch(error => {
        console.log("MySQL connection failed:", error.message);
    });

app.get("/", (req, res) => {
    res.send("Welcome to Student API");
});

// GET all students
app.get("/students", async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM `5r5_student`"
        );
        res.json(rows);
    } catch (error) {
        res.send("Database error: " + error.message);
    }
});

// POST student
app.post("/students", async (req, res) => {
    try {
        const { name, age } = req.body;

        await db.execute(
            "INSERT INTO `5r5_student` (name, age) VALUES (?, ?)",
            [name, age]
        );

        res.send("Student added successfully");
    } catch (error) {
        res.send("Database error: " + error.message);
    }
});

// PUT student
app.put("/students/:id", async (req, res) => {
    try {
        const { name, age } = req.body;

        await db.execute(
            "UPDATE `5r5_student` SET name = ?, age = ? WHERE id = ?",
            [name, age, req.params.id]
        );

        res.send("Student updated successfully");
    } catch (error) {
        res.send("Database error: " + error.message);
    }
});

// DELETE student
app.delete("/students/:id", async (req, res) => {
    try {
        await db.execute(
            "DELETE FROM `5r5_student` WHERE id = ?",
            [req.params.id]
        );

        res.send("Student deleted successfully");
    } catch (error) {
        res.send("Database error: " + error.message);
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
