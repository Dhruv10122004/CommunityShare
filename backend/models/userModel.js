const pool = require('../config/db');

exports.createUser = async (user) => {
    const {
        username,
        email,
        password_hash, // destructuring to extract data from object.
        first_name,
        last_name,
        phone,
        address,
        city,
        state,
        zip_code,
        profile_image
    } = user;
    // returning * to get the inserted user data back.
    // This is useful for confirming the insertion and returning the user object.
    const res = await pool.query(
    `INSERT INTO users
    (username, email, password_hash, first_name, last_name, phone, address, city, state, zip_code, profile_image)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *`,
    [username, email, password_hash, first_name, last_name, phone, address, city, state, zip_code, profile_image]
  );
  return res.rows[0]; // Return the created user
}

exports.findUserByEmail = async (email) => {
    const res = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return res.rows[0]; // Return the user if found, otherwise undefined
};

exports.deleteUser = async (userId) => {
    const res = await pool.query(
      `delete from users where id = $1 returning *`,
      [userId]
    );
    return res.rows[0]; // Return the deleted user
};