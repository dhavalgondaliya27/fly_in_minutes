import { asyncHandler } from '../../../utils/asyncHandler.js';
import { SubCategory } from './sub-category.model.js';

const createSubCategory = asyncHandler(async (req, res) => {
  const { sub_category_name, category_id } = req.body;

  if (!sub_category_name || !category_id) {
    return res.error(400, 'Sub category name and category ID are required.');
  }

  const existingSubCategory = await SubCategory.findOne({
    sub_category_name: sub_category_name.trim(),
  });
  if (existingSubCategory) {
    return res.error(400, 'Sub category already exists.');
  }

  const newSubCategory = new SubCategory({
    sub_category_name: sub_category_name.trim(),
    category_id,
  });

  await newSubCategory.save();

  return res.success(201, newSubCategory, 'Sub category created successfully.');
});

const updateSubCategory = asyncHandler(async (req, res) => {
  const { subCategoryId } = req.params;
  const { sub_category_name, category_id } = req.body;

  if (!subCategoryId) {
    return res.error(400, 'Sub category ID is required.');
  }

  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory) {
    return res.error(404, 'Sub category not found.');
  }

  if (sub_category_name) {
    const existingSubCategory = await SubCategory.findOne({
      sub_category_name: sub_category_name.trim(),
      _id: { $ne: subCategoryId },
    });

    if (existingSubCategory) {
      return res.error(400, 'Sub category name already exists.');
    }

    subCategory.sub_category_name = sub_category_name.trim();
  }

  if (category_id) {
    subCategory.category_id = category_id;
  }

  await subCategory.save();

  return res.success(200, subCategory, 'Sub category updated successfully.');
});

// Updated deleteSubCategory (soft delete)
const deleteSubCategory = asyncHandler(async (req, res) => {
  const { subCategoryId } = req.params;

  if (!subCategoryId) {
    return res.error(400, 'Sub category ID is required.');
  }

  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory) {
    return res.error(404, 'Sub category not found.');
  }

  subCategory.status = 0; // Mark as deleted
  await subCategory.save();

  return res.success(200, null, 'Sub category deleted successfully.');
});

// Updated getSubCategoryByCategoryId (fetch only active ones)
const getSubCategoryByCategoryId = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return res.error(400, 'Category ID is required.');
  }

  const subCategories = await SubCategory.find({
    category_id: categoryId,
    status: 1, // Only fetch active subcategories
  });

  return res.success(200, subCategories, 'Sub categories fetched successfully.');
});

const getAllSubCategory = asyncHandler(async (req, res) => {
  const subCategories = await SubCategory.find({ status: 1 }); // Only active subcategories

  return res.success(200, subCategories, 'Sub categories fetched successfully.');
});

export {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoryByCategoryId,
  getAllSubCategory,
};
