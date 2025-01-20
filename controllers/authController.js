const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// User Signup
exports.signup = async (req, res) => {
  try {
    const {username, email, password, confirmPassword} = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({message: 'Passwords do not match'});
    }
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: 'Email is already in use'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({username, email, password: hashedPassword});
    await user.save();
    res.status(201).json({message: 'User created successfully'});
  } catch (error) {
    res
      .status(400)
      .json({message: 'Error in user creation', error: error.message});
  }
};
// User Login
exports.login = async (req, res) => {
  try {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({message: 'Invalid credentials'});
    }
    const token = jwt.sign({userId: user._id}, 'mouni12', {expiresIn: '1h'});
    // Mark user as logged in
    user.isLoggedIn = true;
    await user.save();
    res.status(200).json({token, userId: user._id, username: user.username});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Internal server error', error: error.message});
  }
};

// User Logout
exports.logout = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    user.isLoggedIn = false;
    user.lastLogout = new Date();
    await user.save();
    res.status(200).json({message: 'Logout successful, user logged out'});
  } catch (error) {
    console.error('Logout Error:', error.message);
    res
      .status(500)
      .json({message: 'Internal server error', error: error.message});
  }
};
// Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    const {username, email, password} = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found.'});
    }
    if (user.username !== username || user.email !== email) {
      return res.status(400).json({message: 'Username or email do not match.'});
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({message: 'Incorrect password.'});
    }
    await User.findByIdAndDelete(userId);
    return res.status(200).json({
      message: 'Account deleted successfully',
      userId: user._id,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    console.error('Error in deleting account:', error.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
