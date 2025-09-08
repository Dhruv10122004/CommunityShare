// db.js or database.js
const { Pool } = require('pg');
require('dotenv').config(); // Make sure to load environment variables

// Create a new Pool instance
const pool = new Pool({
  // Use the DATABASE_URL from Render's environment variables
  connectionString: process.env.DATABASE_URL,
  
  // Render requires SSL for its database connections
  // The rejectUnauthorized: false setting is needed for development
  // and some production environments on Render.
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool; // export the pool instance directly