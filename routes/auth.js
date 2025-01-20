const express = require('express');
const {
  signup,
  login,
  logout,
  deleteAccount,
} = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
// Logout Route
router.post('/logout', authenticateToken, logout);
router.delete('/deleteAccount/:userId', authenticateToken, deleteAccount);

module.exports = router;
