const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error]: ${error.message}`);
    // Exit process with failure code if database connection fails
    process.exit(1);
  }
};

module.exports = connectDB;