const express = require('express');
const router = express.Router();
const {
  getAll,
  getById,
  addStock,
  removeStock,
  reservation,
  sold,
} = require('../controllers/inventory.controller');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/add-stock', addStock);
router.post('/remove-stock', removeStock);
router.post('/reservation', reservation);
router.post('/sold', sold);

module.exports = router;
