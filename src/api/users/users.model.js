import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    password: {
      type: String,
    },
    google_id: {
      type: String,
      default: null,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    auth0Id: {
      type: String,
    },
    chatToken: {
      type: String,
    },
    referral_code: {
      type: String,
      default: null,
    },
    referral_user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    referral_code_discount_amount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
export const User = mongoose.model('User', userSchema);
