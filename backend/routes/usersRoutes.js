const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');
const { updateUserRoleValidation } = require('../middleware/validation');

// Get all users (admin only)
router.get('/', auth, auth.isAdmin, usersController.getAllUsers);

// Update user role (admin only)
router.patch('/:id/role', auth, auth.isAdmin, updateUserRoleValidation, usersController.updateUserRole);

module.exports = router;
