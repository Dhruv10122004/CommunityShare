const itemModel = require('../models/itemModel');

exports.createItem = async (req, res) => {
    try {
        // Get image URL if file is uploaded
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        // Pass all form fields and add owner_id + image_url
        const item = await itemModel.createItem({
            ...req.body,
            owner_id: req.user.id,
            image_url, // Add the image path to DB
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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
        res.status(500).json({ message: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const deleted = await itemModel.deleteItem(req.params.id, req.user.id);
        if(!deleted) {
            return res.status(404).json({ message: 'Item not found or unauthorized' });
        }
        res.status(200).json({ message: 'Item deleted successfully', item: deleted });
    } catch (error) {
        res.startus(500).json({ message: error.message });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await itemModel.getAll();
        res.status(200).json(items.rows); // items is a result object, we need to return rows
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const result = await itemModel.getItemByid(Number(req.params.id));
        console.log(req.params.id);
        if (!result.rows || result.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Get all items listed by the current user
exports.getMyListings = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT
    const items = await itemModel.getItemByOwnerIdListed(userId);
    // console.log("🟡 getItemByOwnerIdListed returned:", items); // <-- debug this
    // console.log(items.rows[0].image_url);
    res.json(items.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching user listings' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.user.id;
    const existing = await itemModel.getItemByid(itemId);
    console.log('Item being handled:', itemId);
    console.log('User making request:', req.user.id);
    console.log('Item owner:', existing.rows[0].owner_id);

    if (!existing) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Ensure both IDs are compared as strings
    if (String(existing.rows[0].owner_id) !== String(userId)) {
      console.log('Unauthorized update attempt by user', userId, 'for item owned by', existing.owner_id);
      return res.status(403).json({ message: 'You are not authorized to update this item.' });
    }

    const updatedItem = await itemModel.updateItem(itemId, req.body);
    res.json(updatedItem);
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ message: 'Server error while updating item' });
  }
};
