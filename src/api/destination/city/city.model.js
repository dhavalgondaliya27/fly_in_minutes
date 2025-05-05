import mongoose, { Schema } from 'mongoose';

const citySchema = new Schema(
  {
    city_name: {
      type: String,
      required: true,
      unique: true,
    },
    category_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
    destination_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: true,
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

export const City = mongoose.model('City', citySchema);
