const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body;
    const category = await Category.create({ name, slug, description });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory };