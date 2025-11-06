const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const auth = require('../middleware/auth');
const { createPostValidation, updatePostValidation } = require('../middleware/validation');

// Get all posts 
router.get('/', auth, postsController.getAllPosts);

// Get single post by ID 
router.get('/:id', auth, postsController.getPostById);

// Create new post (admin only)
router.post('/', auth, auth.isAdmin, createPostValidation, postsController.createPost);

// Update post (admin only)
router.put('/:id', auth, auth.isAdmin, updatePostValidation, postsController.updatePost);

// Delete post (admin only)
router.delete('/:id', auth, auth.isAdmin, postsController.deletePost);

module.exports = router;
