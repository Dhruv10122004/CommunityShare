const itemModel = require('../models/itemModel');

exports.createItem = async (req, res) => {
    try {
        const item = await itemModel.createItem({...req.body, owner_id: req.user.id}); // after spread operator we can add new properties or update the existing ones.
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

exports.getMyListedItems = async (req, res) => {
    try {
        const result = await itemModel.getItemByOwnerIdListed(req.user.id);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}