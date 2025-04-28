import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
    category_photo: {
      type: [String],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Category = mongoose.model('Category', categorySchema);
