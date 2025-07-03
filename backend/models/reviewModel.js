const pool = require('../config/db');

exports.createReview = async (review) => {
    const res = await pool.query(
        `INSERT INTO reviews (booking_id, reviewer_id, reviewed_user_id, rating, comment)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [booking_id, reviewer_id, reviewed_user_id, rating, comment]
    );

    // updating aggregate rating of the reviewed user
    await pool.query(
        `update users set
        rating = (select round(avg(rating), 2) from reviews
        where reviewed_user_id = $1),
        total_reviews = total_reviews + 1
        where id = $1`,
        [reviewed_user_id]
    );
    return res.rows[0]; // Return the created review
};

exports.getUserReviews = async (userId) => {
    const res = await pool.query(
        `select * from reviews where reviewed_user_id = $1 order by created_at desc`,
        [userId]
    );
    return res.rows; // Return all reviews for the user
};

