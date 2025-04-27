import mongoose, { Schema } from 'mongoose';

const destinationSchema = new Schema(
  {
    destination_name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Destination = mongoose.model('Destination', destinationSchema);
