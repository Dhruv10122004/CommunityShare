const itemModel = require('../models/itemModel');

// Create new item
exports.createItem = async (req, res) => {
  try {
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const item = await itemModel.createItem({
      ...req.body,
      owner_id: req.user.id,
      image_url,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get items (optionally filtered by category)
exports.getItems = async (req, res) => {
  try {
    const { categoryId } = req.query;
    let items;

    if (categoryId) {
      items = await itemModel.getItemsByCategoryId(categoryId);
    } else {
      items = await itemModel.getItemsWithOwner();
    }

    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all items (basic)
exports.getAllItems = async (req, res) => {
  try {
    const items = await itemModel.getAll();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching all items:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single item by id
exports.getItemById = async (req, res) => {
  try {
    const item = await itemModel.getItemById(Number(req.params.id));
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    console.error('Error fetching item by id:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get current user's listings
exports.getMyListings = async (req, res) => {
  try {
    const items = await itemModel.getItemByOwnerIdListed(req.user.id);
    res.json(items);
  } catch (err) {
    console.error('Error fetching my listings:', err);
    res.status(500).json({ message: 'Server error while fetching user listings' });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const deleted = await itemModel.deleteItem(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Item not found or unauthorized' });
    }
    res.status(200).json({ message: 'Item deleted successfully', item: deleted });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update item
exports.updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.user.id;

    const existing = await itemModel.getItemById(itemId);

    if (!existing) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (String(existing.owner_id) !== String(userId)) {
      return res.status(403).json({ message: 'You are not authorized to update this item.' });
    }

    const updatedItem = await itemModel.updateItem(itemId, req.body);
    res.json(updatedItem);
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ message: 'Server error while updating item' });
  }
};
