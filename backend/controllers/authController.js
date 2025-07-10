const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken'); // for generating JWT tokens
const userModel = require('../models/userModel'); // Import the user model
const pool = require('../config/db');

exports.register = async (req, res) => {
    try {
        const userExists = await userModel.findUserByEmail(req.body.email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashed = await bcrypt.hash(req.body.password, 10); // used to hash the password and make it of length 10
        const newUser = await userModel.createUser({ ...req.body, password_hash: hashed }); // createUser is a function in userModel.js that creates a new user
        //use spread operator to copy properties from req.body and add password_hash (can update any properties if needed)
        res.status(201).json({ token: generateToken(newUser.id), user: newUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await userModel.findUserByEmail(req.body.email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const match = await bcrypt.compare(req.body.password, user.password_hash);
        if (!match) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.json({ token: generateToken(user.id), user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const deleted = await userModel.deleteUser(req.user.id); // req.user.id is set by the protect middleware
        if (!deleted) {
            return res.status(404).json({ message: 'User not found or unauthorized' });
        }
        res.status(200).json({ message: 'Account deleted successfully', user: deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProfileData = async (req, res) => {
  try {
    const userId = req.user.id;

    const userRes = await pool.query('SELECT username, email FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];
    console.log(user);

    const totalBookingsRes = await pool.query(
      'SELECT COUNT(*) FROM bookings WHERE borrower_id = $1',
      [userId]
    );
    const currentlyBorrowedRes = await pool.query(
      "SELECT COUNT(*) FROM bookings WHERE borrower_id = $1 AND status = 'active'",
      [userId]
    );

    res.json({
      name: user.username,
      email: user.email,
      totalBookings: parseInt(totalBookingsRes.rows[0].count),
      currentlyBorrowed: parseInt(currentlyBorrowedRes.rows[0].count)
    });
  } catch (err) {
    console.error('Error fetching profile data:', err);
    res.status(500).json({ message: 'Server error fetching profile data' });
  }
};
