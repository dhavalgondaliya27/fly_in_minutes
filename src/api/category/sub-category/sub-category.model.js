  import mongoose, { Schema } from 'mongoose';

  const subCategorySchema = new Schema(
    {
      sub_category_name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
      status: {
        type: Number,
        default: 1,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

  export const SubCategory = mongoose.model('SubCategory', subCategorySchema);
