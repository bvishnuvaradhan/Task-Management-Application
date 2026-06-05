const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    if (!dbURI) {
      throw new Error('No database connection string provided in environment variables.');
    }
    await mongoose.connect(dbURI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
