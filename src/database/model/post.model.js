import mongoose, { Schema, model } from 'mongoose';

const postSchema = new Schema({
  content: {
    type: String,
    minlength: 2,
    maxlength: 1000,
    trim: true,
    required: function () {
      return this.attachments.length ? false : true;
    },
  },
  attachments: [{
    secure_url: String,
    public_id: String,
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  isDeleted: Boolean,
}, { timestamps: true });

export const postModel = mongoose.models.Post || model('Post', postSchema);