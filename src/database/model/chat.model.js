import { Schema } from "mongoose";

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId, ref: "User",
    required: true
  },
  content: { type: String, required: true },
}, { timestamps: true });
const chatSchema = new Schema({
  users: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    validate: [arrayLimit, '{PATH} exceeds the limit of 2']
  },
  messages: [messageSchema],
}, { timestamps: true });


export const chatModel = mongoose.model("Chat", chatSchema);