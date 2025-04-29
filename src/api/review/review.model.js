import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    experience_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Experience',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Number,
      default: 1, // 1 for active, 0 for inactive
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Review = mongoose.model('Review', reviewSchema);
