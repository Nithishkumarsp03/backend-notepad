const { Pool } = require("pg");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// For Neon database, use connection string approach
const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?sslmode=require`;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});


// Connect to DB and log success/error
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL database"))
  .catch((err) => console.error("❌ Database connection error:", err.stack));

module.exports = pool;