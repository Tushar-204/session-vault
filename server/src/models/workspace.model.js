import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Workspace title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    color: {
      type: String,
      default: '#3b82f6', // Tailwind blue accent
    },
    icon: {
      type: String,
      default: 'Folder',
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isFavorite: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    isTrash: {
      type: Boolean,
      default: false,
      index: true,
    },
    trashDate: {
      type: Date,
      default: null,
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    tabCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Text Index for multi-field fuzzy text search
workspaceSchema.index({ title: 'text', description: 'text', tags: 'text' });
workspaceSchema.index({ userId: 1, createdAt: -1 });

export const Workspace = mongoose.model('Workspace', workspaceSchema);
