import mongoose, { Schema } from 'mongoose';

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    cover_image: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      default: null,
    },
    author: {
      type: String,
      default: 'Admin',
    },
    is_published: {
      type: Boolean,
      default: true,
    },
    publish_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Blog = mongoose.model('Blog', blogSchema);
