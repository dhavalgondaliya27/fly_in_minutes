import mongoose, { Schema } from 'mongoose';

const experienceTimeSchema = new Schema(
  {
    experience_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Experience',
      required: true,
      unique: true,
    },
    time: [
      {
        day: {
          type: String,
          required: true, // e.g., "Monday", "Tuesday", or use numbers 0–6
        },
        start_time: {
          type: String, // HH:mm format like "09:00"
          required: true,
        },
        end_time: {
          type: String, // HH:mm format like "18:00"
          required: true,
        },
        last_entry_time: {
          type: String, // HH:mm format like "17:00"
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ExperienceTime = mongoose.model('ExperienceTime', experienceTimeSchema);
