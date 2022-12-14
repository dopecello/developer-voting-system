const express = require("express");
const apiRoutes = require("./routes/apiRoutes");
const db = require("./db/connection");
const inputCheck = require("./utils/inputCheck");
const mysql = require("mysql2");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`This shit is bussin on port ${PORT}`);
});
