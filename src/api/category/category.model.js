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

export const Category = mongoose.model('Category', categorySchema);
