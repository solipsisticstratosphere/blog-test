const { models } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await models.User.findAll({
      attributes: ['id', 'username', 'email', 'isAdmin', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body;

    const user = await models.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.id === req.userId) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    await user.update({ isAdmin });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
