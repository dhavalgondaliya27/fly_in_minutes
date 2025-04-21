import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Category = mongoose.model('Category', categorySchema);
