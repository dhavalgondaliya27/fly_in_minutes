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
    instant_confirmation: {
      type: Boolean,
      default: false,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    sub_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: true,
    },
    experience_details_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExperienceDetail',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    experience_address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExperienceAddress',
    },
    destination_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
    },
    city_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
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

export const Experience = mongoose.model('Experience', experienceSchema);
