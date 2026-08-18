import { Folder } from '../models/folder.model.js';

export class FolderRepository {
  async findByUserId(userId) {
    return await Folder.find({ userId }).sort({ position: 1, createdAt: -1 });
  }

  async findById(id, userId) {
    return await Folder.findOne({ _id: id, userId });
  }

  async create(folderData) {
    return await Folder.create(folderData);
  }

  async updateById(id, userId, updateData) {
    return await Folder.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );
  }

  async deleteById(id, userId) {
    return await Folder.findOneAndDelete({ _id: id, userId });
  }
}

export const folderRepository = new FolderRepository();
