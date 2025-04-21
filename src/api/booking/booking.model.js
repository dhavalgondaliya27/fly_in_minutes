import mongoose, { Schema } from 'mongoose';

const bookingSchema = new Schema(
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
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    adult: {
      type: Number,
      default: 0,
    },
    child: {
      type: Number,
      default: 0,
    },
    infant: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total_price: {
      type: Number,
      required: true,
    },
    promo_code: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Booking = mongoose.model('Booking', bookingSchema);
