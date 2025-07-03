const catModel = require('../models/catModel');

exports.getCategories = async (req, res) => {
    try {
        const categories = await catModel.getAllCategories();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createCategory = async (req, res) => {
  try {
    const existing = await catModel.findByName(req.body.name);
    if (existing) {
      return res.status(409).json({ message: 'Category already exists' });
    }
    const category = await catModel.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

