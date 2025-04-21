import mongoose, { Schema } from 'mongoose';

const experienceAddressSchema = new Schema(
  {
    experience_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Experience',
      required: true,
      unique: true,
    },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postal_code: { type: String },
    landmark: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ExperienceAddress = mongoose.model('ExperienceAddress', experienceAddressSchema);
