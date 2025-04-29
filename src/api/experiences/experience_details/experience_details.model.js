import mongoose, { Schema } from 'mongoose';

const experienceDetailSchema = new Schema(
  {
    experience_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Experience',
      required: true,
      unique: true,
    },
    highlights: {
      type: [String],
      default: [],
    },
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
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

export const ExperienceDetail = mongoose.model('ExperienceDetail', experienceDetailSchema);
