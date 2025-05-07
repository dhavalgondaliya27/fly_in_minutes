import { Category } from './category.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { uploadFile, deleteFile, getSignedUrl } from '../../services/s3-bucket/s3-service.js';
import { createCategorySchema, updateCategorySchema } from './category.validator.js';

const createCategory = asyncHandler(async (req, res) => {
  const { error } = createCategorySchema.validate(req.body);
  if (error) return res.error(400, error.message);

  const { category_name, parent_category_id } = req.body;
  const trimmedName = category_name.trim();
  const files = req.files || [];

  const existingCategory = await Category.findOne({ category_name: trimmedName, status: 1 });
  if (existingCategory) return res.error(400, 'Category already exists');

  const categoryData = {
    category_name: trimmedName,
    status: 1,
    category_photo: [],
  };

  if (parent_category_id) {
    if (!mongoose.Types.ObjectId.isValid(parent_category_id)) {
      return res.error(400, 'Invalid parent category ID format');
    }
    console.log(parent_category_id);
    const parentExists = await Category.findOne({ _id: parent_category_id, status: 1 });
    if (!parentExists) return res.error(400, 'Parent category not found');
    categoryData.parent_category_id = parent_category_id;
  }

  const newCategory = await Category.create(categoryData);

  if (files.length > 0) {
    const uploadedPhotos = await Promise.all(
      files.map(async (file) => {
        const key = `categories/${newCategory._id}/${file.originalname}`;
        await uploadFile(file.buffer, key, file.mimetype);
        return key;
      })
    );

    newCategory.category_photo = uploadedPhotos;
    await newCategory.save();
  }

  return res.success(201, newCategory, 'Category created successfully');
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ status: 1 }).sort({ createdAt: -1 });

  if (!categories || categories.length === 0) {
    return res.success(200, [], 'No categories found');
  }

  const categoriesWithSignedUrls = await Promise.all(
    categories.map(async category => {
      const categoryData = category.toObject();
      if (category.category_photo && category.category_photo.length > 0) {
        categoryData.category_photo = await Promise.all(
          category.category_photo.map(async key => await getSignedUrl(key))
        );
      } else {
        categoryData.category_photo = [];
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
    categoryData.category_photo = await Promise.all(
      category.category_photo.map(async key => await getSignedUrl(key))
    );
  } else {
    categoryData.category_photo = [];
  }

  return res.success(200, categoryData, 'Category fetched successfully');
});

const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { category_name, parent_category_id } = req.body;
  const { error } = updateCategorySchema.validate(req.body);
  if (error) {
    return res.error(400, error.message);
  }
  const files = req.files;

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

  if (parent_category_id) {
    category.parent_category_id = parent_category_id;
  }
  category.category_name = category_name.trim() || category.category_name;
  await category.save();

  return res.success(200, category, 'Category updated successfully');
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findOne({ _id: categoryId, status: 1 });
  if (!category) {
    return res.error(404, 'Category not found');
  }

  const subCategories = await Category.find({ parent_category_id: categoryId, status: 1 });
  if (subCategories.length > 0) {
    return res.error(400, 'Cannot delete category with sub categories');
  }

  category.status = 0;
  await category.save();

  return res.success(200, null, 'Category deleted successfully');
});

const getSubCategoryByCategoryId = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const subCategories = await Category.find({ parent_category_id: categoryId, status: 1 });
  if (!subCategories || subCategories.length === 0) {
    return res.success(200, [], 'No sub categories found');
  }
  return res.success(200, subCategories, 'Sub categories fetched successfully');
});

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getSubCategoryByCategoryId,
};
