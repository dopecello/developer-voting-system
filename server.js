const express = require("express");
const inputCheck = require("./utils/inputCheck");
const mysql = require("mysql2");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "dopecello",
    password: "Jax123!@#",
    database: "election",
  },
  console.log("Connected to the election database.")
);

//GETTING all candidates
app.get("/api/candidates", (req, res) => {
  const sql = `SELECT candidates.*, parties.name 
  AS party_name 
  FROM candidates 
  LEFT JOIN parties 
  ON candidates.party_id = parties.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500), json({ message: err.message });
      return;
    }
    res.json({
      message: "Hallelujah!",
      data: rows,
    });
  });
});

//GETTING a single candidate
app.get("/api/candidates/:id", (req, res) => {
  const sql = `SELECT candidates.*, parties.name 
  AS party_name 
  FROM candidates 
  LEFT JOIN parties 
  ON candidates.party_id = parties.id 
  WHERE candidates.id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({
      message: "Hallelujah!",
      data: row,
    });
  });
});

//DELETE a candidate
app.delete("/api/candidates/:id", (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: "Candidate not found!",
      });
    } else {
      res.json({
        message: "Candidate CUT!!",
        changes: result.affectedRows,
        id: req.params.id,
      });
    }
  });
});

//Creating a candidate
app.post("/api/candidates", ({ body }, res) => {
  const errors = inputCheck(
    body,
    "first_name",
    "last_name",
    "industry_connected"
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "Hallelujah!",
      data: body,
    });
  });
});

//GETTING all parties

app.get("/api/parties", (req, res) => {
  const sql = `SELECT * FROM parties`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "Hallelujah!",
      data: rows,
    });
  });
});

//GETTING single party by id

app.get("/api/parties/:id", (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "Hallelujah!",
      data: row,
    });
  });
});

//DELETE party by id

app.delete("/api/parties/:id", (req, res) => {
  const sql = `DELETE FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
      // checks if anything was deleted
    } else if (!result.affectedRows) {
      res.json({
        message: "Party not found",
      });
    } else {
      res.json({
        message: "deleted",
        changes: result.affectedRows,
        id: req.params.id,
      });
    }
  });
});

//Update a candidates party

app.put("/api/candidates/:id", (req, res) => {
  const errors = inputCheck(req.body, "party_id");

  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `UPDATE candidates SET party_id = ? 
   WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      // check if a record was found
    } else if (!result.affectedRows) {
      res.json({
        message: "Candidate not found",
      });
    } else {
      res.json({
        message: "success",
        data: req.body,
        changes: result.affectedRows,
      });
    }
  });
});

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`This shit is bussin on port ${PORT}`);
});
