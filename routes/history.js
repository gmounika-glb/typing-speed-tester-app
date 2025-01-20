const express = require('express');
const router = express.Router();
const {
  getHistory,
  addHistory,
  deleteHistory,
} = require('../controllers/historyController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, getHistory);
router.post('/', authenticateToken, addHistory);
router.delete('/:historyId', authenticateToken, deleteHistory);

module.exports = router;
