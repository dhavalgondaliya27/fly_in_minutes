import { Category } from './category.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

// Create Category
const createCategory = asyncHandler(async (req, res) => {
  const { category_name } = req.body;

  if (!category_name) {
    return res.error(400, 'Category name is required');
  }

  const exists = await Category.findOne({ category_name: category_name.trim() });
  if (exists) {
    return res.error(400, 'Category already exists');

  }

  const category = await Category.create({ category_name: category_name.trim() });

  return res.success(201, category, 'Category created successfully');
});

// Get all categories
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  return res.success(200, categories, 'Categories fetched successfully');
});

// Get category by ID
const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    return res.error(404, 'Category not found');
  }

  return res.success(200, category, 'Category fetched successfully');
});

// Update category
const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { category_name } = req.body;

  if (!category_name) {
    return res.error(400, 'Category name is required');
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    { category_name: category_name.trim() },
    { new: true, runValidators: true }
  );

  if (!category) {
    return res.error(404, 'Category not found');
  }

  return res.success(200, category, 'Category updated successfully');
});

// Delete category
const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    return res.error(404, 'Category not found');
  }

  return res.success(200, null, 'Category deleted successfully');
});

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
