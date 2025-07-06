const pool = require('../config/db');

exports.createItem = async (item) => {
    const {
    title, description, category_id, owner_id,
    price_per_day, is_free, condition,
    availability_status, location, image_url
  } = item;
  const res = await pool.query(
    `INSERT INTO items
    (title, description, category_id, owner_id,
    price_per_day, is_free, condition,
    availability_status, location, image_url)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`,
    [title, description, category_id, owner_id,
     price_per_day, is_free, condition,
     availability_status, location, image_url]
  );
  return res.rows[0]; // Return the created item
};

exports.getItemsWithOwner = async () => {
    const res = await pool.query(`
    SELECT i.*, c.name as category_name, u.username, u.profile_image, u.city, u.phone
    FROM items i
    LEFT JOIN users u ON i.owner_id = u.id
    LEFT JOIN categories c ON i.category_id = c.id
    ORDER BY i.created_at DESC
  `);
  return res.rows;
};

exports.deleteItem = async (itemId, userId) => {
    const res = await pool.query(
      `delete from items where id = $1 and owner_id = $2 returning *`,
      [itemId, userId]
    );
    return res.rows[0]; // Return the deleted item
};

exports.getAll = async () => {
    return await pool.query('SELECT * FROM categories');
};

exports.getItemsByCategoryId = async (categoryId) => {
    const res = await pool.query('select * from items where category_id = $1', [categoryId]);
    return res.rows;
};

exports.getItemByid = async (itemId) => {
    return await pool.query('select * from items where id = $1', [itemId]);
};

exports.getItemByOwnerIdListed = async (ownerId) => {
    return await pool.query('select * from items where owner_id = $1', [ownerId]);
};