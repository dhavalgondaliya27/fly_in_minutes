import { Category } from './category.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { uploadFile, deleteFile, getSignedUrl } from '../../services/s3-bucket/s3-service.js';

const createCategory = asyncHandler(async (req, res) => {
  const { category_name } = req.body;
  const files = req.files;

  if (!category_name) {
    return res.error(400, 'Category name is required');
  }

  const exists = await Category.findOne({ category_name: category_name.trim(), status: 1 });
  if (exists) {
    return res.error(400, 'Category already exists');
  }

  const newCategory = await Category.create({
    category_name: category_name.trim(),
    category_photo: [],
    status: 1, // explicitly set, even though default
  });

  if (files && files.length > 0) {
    const uploadedKeys = [];

    for (const file of files) {
      const key = `categories/${newCategory._id.toString()}/${file.originalname}`;
      await uploadFile(file.buffer, key, file.mimetype);
      uploadedKeys.push(key);
    }

    newCategory.category_photo = uploadedKeys;
    await newCategory.save();
  }

  return res.success(201, newCategory, 'Category created successfully');
});


const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ status: 1 }).sort({ createdAt: -1 });

  const categoriesWithSignedUrls = await Promise.all(
    categories.map(async category => {
      const categoryData = category.toObject();
      if (category.category_photo && category.category_photo.length > 0) {
        categoryData.category_photo_urls = await Promise.all(
          category.category_photo.map(async key => await getSignedUrl(key))
        );
      } else {
        categoryData.category_photo_urls = [];
      }
      return categoryData;
    })
  );

  return res.success(200, categoriesWithSignedUrls, 'Categories fetched successfully');
});


const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findOne({ _id: categoryId, status: 1 });
  if (!category) {
    return res.error(404, 'Category not found');
  }

  const categoryData = category.toObject();
  if (category.category_photo && category.category_photo.length > 0) {
    categoryData.category_photo_urls = await Promise.all(
      category.category_photo.map(async key => await getSignedUrl(key))
    );
  } else {
    categoryData.category_photo_urls = [];
  }

  return res.success(200, categoryData, 'Category fetched successfully');
});


const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { category_name } = req.body;
  const files = req.files;

  if (!category_name) {
    return res.error(400, 'Category name is required');
  }

  const category = await Category.findOne({ _id: categoryId, status: 1 });
  if (!category) {
    return res.error(404, 'Category not found');
  }

  if (files && files.length > 0) {
    if (category.category_photo && category.category_photo.length > 0) {
      for (const oldKey of category.category_photo) {
        await deleteFile(oldKey);
      }
    }

    const uploadedKeys = [];

    for (const file of files) {
      const key = `categories/${category._id.toString()}/${file.originalname}`;
      await uploadFile(file.buffer, key, file.mimetype);
      uploadedKeys.push(key);
    }

    category.category_photo = uploadedKeys;
  }

  category.category_name = category_name.trim();
  await category.save();

  return res.success(200, category, 'Category updated successfully');
});


const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findOne({ _id: categoryId, status: 1 });
  if (!category) {
    return res.error(404, 'Category not found');
  }

  category.status = 0;
  await category.save();

  return res.success(200, null, 'Category deleted successfully');
});


export { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };
