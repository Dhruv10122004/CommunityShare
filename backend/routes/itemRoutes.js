const router = require('express').Router();
const { createItem, getItems, getAllItems, getItemById } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const { deleteItem } = require('../controllers/itemController');
// these are just base urls, full urls are decided when these routes are mounted in the server.js file
// for example, if this file is mounted at /api/items then the full url for createItem will be /api/items
// and the full url for getItems will be /api/items
// if this file is mounted at /api/items/:itemId then the full url for createItem will be /api/items/:itemId
// and the full url for getItems will be /api/items/:itemId
router.get('/', getItems); // GET /api/items
router.get('/all', getAllItems); // GET /api/items/all
router.get('/:id', getItemById);
router.post('/', protect, createItem); // POST /api/items
router.delete('/:id', protect, deleteItem); // DELETE /api/items/:id

module.exports = router;