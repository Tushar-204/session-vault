import mongoose from 'mongoose';

const sharedLinkSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shareCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    accessLevel: {
      type: String,
      enum: ['view', 'clone'],
      default: 'view',
    },
    password: {
      type: String,
      default: null,
      select: false,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const SharedLink = mongoose.model('SharedLink', sharedLinkSchema);
