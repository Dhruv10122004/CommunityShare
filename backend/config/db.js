// db.js or database.js
const { Pool } = require('pg');
require('dotenv').config(); // Make sure to load environment variables

// Create a new Pool instance
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = pool; // export the pool instance directly