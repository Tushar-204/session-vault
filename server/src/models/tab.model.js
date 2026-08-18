import mongoose from 'mongoose';

const tabSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Tab title is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Tab URL is required'],
      trim: true,
    },
    favIconUrl: {
      type: String,
      default: 'https://www.google.com/s2/favicons?domain=google.com&sz=64',
    },
    index: {
      type: Number,
      default: 0,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    windowId: {
      type: String,
      default: 'default',
    },
  },
  {
    timestamps: true,
  }
);

tabSchema.index({ workspaceId: 1, index: 1 });

export const Tab = mongoose.model('Tab', tabSchema);
