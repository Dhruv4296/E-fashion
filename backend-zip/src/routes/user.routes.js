const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Route to get all users
router.get('/', userController.getAllUsers);

// Route to get a specific user's profile
router.get('/profile', userController.getUserProfile);

// Route to create a new user (POST request)
router.post('/', userController.createUser);

// Route to update a user's details (PUT request)
router.put('/:userId', userController.updateUser);

// Route to delete a user (DELETE request)
router.delete('/:userId', userController.deleteUser);

module.exports = router;
