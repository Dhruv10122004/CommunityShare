// db.js or database.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'userdk',
  host: 'localhost',
  database: 'communityshare',
  password: 'Hunter1392',
  port: 5432
});

module.exports = pool; // export the pool instance directly
