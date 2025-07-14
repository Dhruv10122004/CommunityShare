const pool = require('../config/db');

exports.createBooking = async (booking) => {
    const {
        item_id, borrower_id, owner_id, start_date, end_date, total_amount, notes
    } = booking;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const res = await client.query(
            `INSERT INTO bookings
            (item_id, borrower_id, owner_id, start_date, end_date, total_amount, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [item_id, borrower_id, owner_id, start_date, end_date, total_amount, notes]
        );

        await client.query(
            `UPDATE items SET availability_status = 'booked', updated_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [item_id]
        );

        await client.query('COMMIT');
        return res.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

exports.updateBookingStatus = async (id, status) => {
    const res = await pool.query(
        'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, id]
    );
    return res.rows[0]; // Return the updated booking
};

exports.getUserBookings = async (userId) => {
    const res = await pool.query(
        `select b.*, i.title, i.image_url from bookings b
        join items i on b.item_id = i.id
        where b.borrower_id = $1
        order by b.created_at desc`,
        [userId]
    );
    return res.rows; // Return all bookings for the user in the form
};