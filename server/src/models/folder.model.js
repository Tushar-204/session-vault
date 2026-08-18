import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Folder name is required'],
      trim: true,
      maxlength: [60, 'Folder name cannot exceed 60 characters'],
    },
    color: {
      type: String,
      default: '#10b981', // Tailwind emerald accent
    },
    position: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

folderSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Folder = mongoose.model('Folder', folderSchema);
