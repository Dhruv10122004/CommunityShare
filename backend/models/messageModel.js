const pool = require('../config/db');

exports.sendMessage = async (sender_id, receiver_id, item_id, message) => {
  const res = await pool.query(
    'INSERT INTO messages (sender_id, receiver_id, item_id, message) VALUES ($1, $2, $3, $4) RETURNING *',
    [sender_id, receiver_id, item_id, message]
  );
  return res.rows[0];
};

exports.getConversation = async (userId1, userId2) => {
  const res = await pool.query(
    `SELECT * FROM messages
     WHERE (sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1)
     ORDER BY created_at ASC`,
    [userId1, userId2]
  );
  return res.rows;
};

exports.getThreadsForUser = async (userId) => {
  const result = await pool.query(`
    SELECT 
      u.id as user_id,
      u.username,
      m.message as last_message,
      m.created_at as last_time
    FROM (
      SELECT 
        CASE 
          WHEN sender_id = $1 THEN receiver_id
          ELSE sender_id
        END as other_user_id,
        MAX(created_at) as last_time
      FROM messages
      WHERE sender_id = $1 OR receiver_id = $1
      GROUP BY other_user_id
    ) t
    JOIN users u ON u.id = t.other_user_id
    JOIN messages m ON (
      ((m.sender_id = $1 AND m.receiver_id = t.other_user_id) OR (m.sender_id = t.other_user_id AND m.receiver_id = $1))
      AND m.created_at = t.last_time
    )
    ORDER BY t.last_time DESC
  `, [userId]);
  return result.rows;
};