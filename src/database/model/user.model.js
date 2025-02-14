import mongoose, { Schema, model } from "mongoose";
import { GENDER, ROLE } from "../../common/constants";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  confirmEmailOTP: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  phone: String,
  address: String,
  DOB: Date,
  image: String,
  coverImages: [String],
  gender: {
    type: String,
    enum: GENDER,
    default: GENDER.MALE,
  },
  role: {
    type: String,
    enum: ROLE,
    default: ROLE.USER,
  },
  confirmEmail: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  changeCredentialTime: {
    type: Date,
  }
}, { timestamps: true });

export const UserModel = mongoose.model.User || model('User', userSchema);  