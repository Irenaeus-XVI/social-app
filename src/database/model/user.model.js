import mongoose, { Schema, model } from "mongoose";
import { GENDER, PROVIDERS, ROLE } from "../../common/constants/index.js";

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tempEmail: {
    type: String,
  },
  password: {
    type: String,
    required: (data) => {
      return data?.provider === PROVIDERS.LOCAL;
    },
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
  },
  provider: {
    type: String,
    enum: PROVIDERS,
    default: PROVIDERS.LOCAL,
  },
  viewers: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

export const userModel = mongoose.model.User || model('User', userSchema);  