const { models } = require('../models');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await models.Post.findAll({
      include: [{
        model: models.User,
        as: 'author',
        attributes: ['id', 'username']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await models.Post.findByPk(req.params.id, {
      include: [{
        model: models.User,
        as: 'author',
        attributes: ['id', 'username']
      }]
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const newPost = await models.Post.create({
      title,
      content,
      authorId: req.userId
    });

    const post = await models.Post.findByPk(newPost.id, {
      include: [{
        model: models.User,
        as: 'author',
        attributes: ['id', 'username']
      }]
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await models.Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;

    await post.update(updateData);

    const updatedPost = await models.Post.findByPk(post.id, {
      include: [{
        model: models.User,
        as: 'author',
        attributes: ['id', 'username']
      }]
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await models.Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.destroy();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
