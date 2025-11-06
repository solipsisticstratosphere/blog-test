require('dotenv').config();
const { Client } = require('pg');
const { sequelize } = require('../models');

async function setupDatabase() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres' 
  });

  try {
    console.log('Connecting');
    await client.connect();


    const checkDbQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1
    `;
    const result = await client.query(checkDbQuery, [process.env.DB_NAME]);

    if (result.rows.length === 0) {
      console.log(`Creating database "${process.env.DB_NAME}"`);
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`Database "${process.env.DB_NAME}" created successfully`);
    } else {
      console.log(`Database "${process.env.DB_NAME}" already exists`);
    }

    await client.end();


    console.log('Connecting to application database');
    await sequelize.authenticate();
    console.log('Connection to database established');

    console.log('Syncing database models');
    await sequelize.sync({ alter: true });
    console.log('Database models synced successfully');

    await sequelize.close();
    console.log('\nDatabase setup completed successfully');
    process.exit(0);

  } catch (error) {
    console.error('Error', error.message);
    process.exit(1);
  }
}

setupDatabase();
