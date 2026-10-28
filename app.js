
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const secretKey = process.env.JWT_SECRET || "student123";

let students = [
  { id: 1, name: "Sabeeha", age: 18 },
  { id: 2, name: "Keerthana", age: 18 }
];

// HOME PAGE
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Student Management System</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f4f8;
          text-align: center;
          padding: 30px;
        }
        .container {
          background: white;
          max-width: 700px;
          margin: auto;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        h1 {
          color: #234e70;
        }
        a {
          display: inline-block;
          margin: 10px;
          padding: 10px 16px;
          background: #2b6cb0;
          color: white;
          text-decoration: none;
          border-radius: 6px;
        }
        a:hover {
          background: #1a436e;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Student Management System</h1>
        <p>Server is running successfully!</p>
        <a href="/student-list">View Student Names</a>
        <h3>Available API Endpoints</h3>
        <p>POST /login - Login</p>
        <p>GET /students - Get all students (token required)</p>
        <p>POST /students - Add a student (token required)</p>
        <p>PUT /students/:id - Update a student (token required)</p>
        <p>DELETE /students/:id - Delete a student (token required)</p>
      </div>
    </body>
    </html>
  `);
});

// DISPLAY STUDENT NAMES IN THE BROWSER
app.get("/student-list", (req, res) => {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Student List</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f0f4f8;
          text-align: center;
          padding: 30px;
        }
        .container {
          background: white;
          max-width: 700px;
          margin: auto;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 12px;
        }
        th {
          background: #2b6cb0;
          color: white;
        }
        tr:nth-child(even) {
          background: #f2f2f2;
        }
        a {
          display: inline-block;
          margin-top: 20px;
          color: #2b6cb0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Student Management System</h1>
        <h2>Student List</h2>
        <table>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
          </tr>
  `;

  students.forEach(student => {
    html += `
      <tr>
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.age}</td>
      </tr>
    `;
  });

  html += `
        </table>
        <a href="/">Back to Home</a>
      </div>
    </body>
    </html>
  `;

  res.send(html);
});

// LOGIN - GENERATE JWT TOKEN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    const token = jwt.sign(
      { username },
      secretKey,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  }

  return res.status(401).json({
    message: "Invalid username or password"
  });
});

// JWT VERIFICATION MIDDLEWARE
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Valid Bearer token required"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, secretKey);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

// GET - READ ALL STUDENTS
app.get("/students", verifyToken, (req, res) => {
  res.json(students);
});

// POST - ADD A STUDENT
app.post("/students", verifyToken, (req, res) => {
  const { name, age } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    !Number.isInteger(age) ||
    age < 0
  ) {
    return res.status(400).json({
      message: "Enter a valid student name and non-negative integer age"
    });
  }

  const newId = students.length
    ? Math.max(...students.map(student => student.id)) + 1
    : 1;

  const newStudent = {
    id: newId,
    name: name.trim(),
    age
  };

  students.push(newStudent);

  return res.status(201).json({
    message: "Student added successfully",
    student: newStudent
  });
});

// PUT - UPDATE A STUDENT
app.put("/students/:id", verifyToken, (req, res) => {
  const id = Number(req.params.id);
  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({
      message: "Student not found"
    });
  }

  const { name, age } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    !Number.isInteger(age) ||
    age < 0
  ) {
    return res.status(400).json({
      message: "Enter a valid student name and non-negative integer age"
    });
  }

  student.name = name.trim();
  student.age = age;

  return res.json({
    message: "Student updated successfully",
    student
  });
});

// DELETE - DELETE A STUDENT
app.delete("/students/:id", verifyToken, (req, res) => {
  const id = Number(req.params.id);
  const exists = students.some(s => s.id === id);

  if (!exists) {
    return res.status(404).json({
      message: "Student not found"
    });
  }

  students = students.filter(s => s.id !== id);

  return res.json({
    message: "Student deleted successfully"
  });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      message: "Invalid JSON request body"
    });
  }

  return res.status(500).json({
    message: "Internal server error"
  });
});

// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
