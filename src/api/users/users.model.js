import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    DOB: {
      type: Date,
    },
    password: {
      type: String,
      require: true,
    },
    googleId: {
      type: String,
      default: null,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiration: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    refreshToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date
    },
    status: {
      type: Number,
      enum: [0, 1, -1],
      default: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
