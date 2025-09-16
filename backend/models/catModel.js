const db = require('../config/db');

async function getAllCategories() {
  const result = await db.query(
    'SELECT id, name, description, icon, created_at FROM categories ORDER BY name'
  );
  return result.rows;
}

async function createCategory(name, description, icon) {
  const result = await db.query(
    'INSERT INTO categories (name, description, icon) VALUES ($1, $2, $3) RETURNING *',
    [name, description, icon]
  );
  return result.rows[0];
}

async function findByName(name) {
  const result = await db.query(
    'SELECT * FROM categories WHERE LOWER(name) = LOWER($1)',
    [name]
  );
  return result.rows[0];
}

module.exports = { getAllCategories, createCategory, findByName };
