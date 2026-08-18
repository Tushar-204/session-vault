import { folderRepository } from '../repositories/folder.repository.js';
import { Workspace } from '../models/workspace.model.js';
import { ApiError } from '../utils/ApiError.js';

export class FolderService {
  async getFolders(userId) {
    return await folderRepository.findByUserId(userId);
  }

  async createFolder(userId, name, color) {
    return await folderRepository.create({ userId, name, color });
  }

  async updateFolder(folderId, userId, updateData) {
    const folder = await folderRepository.updateById(folderId, userId, updateData);
    if (!folder) throw new ApiError(404, 'Folder not found.');
    return folder;
  }

  async deleteFolder(folderId, userId) {
    const folder = await folderRepository.findById(folderId, userId);
    if (!folder) throw new ApiError(404, 'Folder not found.');

    // Unlink workspaces from this folder before deleting it
    await Workspace.updateMany({ folderId, userId }, { $set: { folderId: null } });

    return await folderRepository.deleteById(folderId, userId);
  }
}

export const folderService = new FolderService();
