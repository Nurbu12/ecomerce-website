const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[MongoDB Connected for Seeding]');

    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    // Create a dummy admin/seller user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const adminUser = await User.create({
      name: 'Admin Seller',
      email: 'admin@shopsphere.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Fetching 100 products from DummyJSON API...');
    const response = await fetch('https://dummyjson.com/products?limit=100');
    const data = await response.json();
    const products = data.products;

    // Extract unique categories and create them in DB first
    const uniqueCategoryNames = [...new Set(products.map((p) => p.category))];
    const categoryMap = {}; // Maps category name string to MongoDB ObjectId

    for (const catName of uniqueCategoryNames) {
      const formattedName = catName.charAt(0).toUpperCase() + catName.slice(1);
      const createdCategory = await Category.create({
        name: formattedName,
        slug: catName,
        description: `Products related to ${formattedName}`,
      });
      categoryMap[catName] = createdCategory._id;
    }

    // Map fetched products to match your Mongoose schema
    const docs = products.map((p) => ({
      name: p.title,
      description: p.description,
      price: p.price,
      compareAtPrice: Number((p.price * 1.25).toFixed(2)),
      category: categoryMap[p.category],
      images: p.images && p.images.length > 0 ? p.images : [p.thumbnail],
      rating: p.rating,
      numReviews: p.reviews?.length || 10,
      stock: p.stock || 20,
      seller: adminUser._id,
    }));

    await Product.insertMany(docs);
    console.log(`[SUCCESS]: Seeded ${docs.length} products and ${uniqueCategoryNames.length} categories successfully!`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    process.exit(1);
  }
};

importData();