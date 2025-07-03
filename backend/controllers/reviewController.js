const reviewModel = require('../models/reviewModel');

exports.addReview = async (req, res) => {
    try {
        const review = await reviewModel.createReview({
            ...req.body,  // not two arguments, but a single object with properties from req.body
            reviewer_id: req.user.id
        });
        res.status(201).json(review);
    } catch (error) {  
        res.status(500).json({ message: error.message });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const { userId } = req.params; // Use req.params to get values from the URL path.
        const reviews = await reviewModel.getUserReviews(userId);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

