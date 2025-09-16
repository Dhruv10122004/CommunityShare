const pool = require('../config/db');

// Create a new item
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
    [
      title, description, category_id, owner_id,
      price_per_day, is_free, condition,
      availability_status, location, image_url
    ]
  );
  return res.rows[0]; // ✅ single item
};

// Get all items with owner + category info
exports.getItemsWithOwner = async () => {
  const res = await pool.query(`
    SELECT i.*, 
           c.name as category_name, 
           u.username, u.profile_image, u.city, u.phone
    FROM items i
    LEFT JOIN users u ON i.owner_id = u.id
    LEFT JOIN categories c ON i.category_id = c.id
    ORDER BY i.created_at DESC
  `);
  return res.rows; // ✅ array
};

// Delete item by id + owner
exports.deleteItem = async (itemId, userId) => {
  const res = await pool.query(
    `DELETE FROM items WHERE id = $1 AND owner_id = $2 RETURNING *`,
    [itemId, userId]
  );
  return res.rows[0]; // ✅ deleted item or undefined
};

// Get all items (basic)
exports.getAll = async () => {
  const res = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
  return res.rows; // ✅ array
};

// Get items by category
exports.getItemsByCategoryId = async (categoryId) => {
  const res = await pool.query(
    'SELECT * FROM items WHERE category_id = $1 ORDER BY created_at DESC',
    [categoryId]
  );
  return res.rows; // ✅ array
};

// Get item by id
exports.getItemById = async (itemId) => {
  const res = await pool.query('SELECT * FROM items WHERE id = $1', [itemId]);
  return res.rows[0]; // ✅ single item
};

// Get all items by owner
exports.getItemByOwnerIdListed = async (ownerId) => {
  const res = await pool.query(
    'SELECT * FROM items WHERE owner_id = $1 ORDER BY created_at DESC',
    [ownerId]
  );
  return res.rows; // ✅ array
};

// Update item
exports.updateItem = async (id, data) => {
  const { title, description, location, price_per_day, condition, availability_status } = data;

  const result = await pool.query(
    `UPDATE items SET
        title = $1,
        description = $2,
        location = $3,
        price_per_day = $4,
        condition = $5,
        availability_status = $6,
        updated_at = NOW()
     WHERE id = $7
     RETURNING *`,
    [title, description, location, price_per_day, condition, availability_status, id]
  );

  return result.rows[0]; // ✅ updated item
};
