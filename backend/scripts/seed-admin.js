require('dotenv').config();
const { sequelize, models } = require('../models');
const { User } = models;

async function seedAdmin() {
  try {
    console.log('Connecting to database');
    await sequelize.authenticate();
    console.log('Connected successfully');

    const adminEmail = 'admin@example.com';
    const adminUsername = 'admin';
    const adminPassword = '123456';


    const existingAdmin = await User.findOne({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log(`Admin user with email "${adminEmail}" already exists`);
      console.log('Skipping admin creation');
    } else {

      console.log('Creating admin user');
      const admin = await User.create({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        isAdmin: true
      });

      console.log('\nAdmin user created successfully!');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
    }

    await sequelize.close();
    console.log('\nDatabase connection closed');
    process.exit(0);

  } catch (error) {
    console.error('Error during admin seeding', error.message);
    if (error.errors) {
      error.errors.forEach(err => {
        console.error('Validation error:', err.message);
      });
    }
    process.exit(1);
  }
}

seedAdmin();
