const db = require("../../config/db");

const fetchCategory = (req, res) => {
  const query = `SELECT id, topic, description FROM master_category WHERE status = 1`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send({ message: "Error fetching category" });
    } else {
      res.status(200).json(results.rows); // Use `.rows` for PostgreSQL
    }
  });
};

module.exports = { fetchCategory };
