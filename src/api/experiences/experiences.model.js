import mongoose, { Schema } from 'mongoose';

const experienceSchema = new Schema(
  {
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
    property_name: {
      type: String,
      required: true,
      trim: true,
    },
    property_image: {
      type: [String], // Array of strings for storing image URLs or paths
      required: true,
    },
    is_cancellation: {
      type: Boolean,
      default: false,
    },
    about: {
      type: String,
      required: true,
    },
    ticket_validity: {
      type: Date,
    },
    my_ticket: {
      type: String,
      required: true,
    },
    know_before_you_go: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: [String],
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Experience = mongoose.model('Experience', experienceSchema);
