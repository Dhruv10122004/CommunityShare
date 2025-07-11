const db = require('../config/db');

async function getAllCategories() {
    const result = await db.query('SELECT id, name, description FROM categories ORDER BY name');
    return result.rows;
}

async function createCategory(name, description, icon) {
    const result = await db.query('insert into categories (name, description, icon) values ($1, $2, $3) returning *', [name, description, icon]);
    return result.rows[0];
}

async function findByName(name) {
  const result = await db.query('SELECT * FROM categories WHERE LOWER(name) = LOWER($1)', [name]);
  return result.rows[0];
}

module.exports = { getAllCategories, createCategory, findByName };