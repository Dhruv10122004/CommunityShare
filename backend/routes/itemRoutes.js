const router = require('express').Router();
const { createItem, getItems, getAllItems, getItemById, getMyListings, updateItem } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const { deleteItem } = require('../controllers/itemController');
const upload = require('../middleware/upload');
const { cacheResponse } = require('../middleware/cacheMiddleware');

router.get('/', cacheResponse(60), getItems);
router.get('/all', cacheResponse(120), getAllItems);
router.get('/my-listings', protect, getMyListings);
router.post('/', protect, upload.single('image'), createItem);
router.get('/:id', cacheResponse(120), getItemById);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;