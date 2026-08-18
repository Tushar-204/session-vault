import { folderService } from '../services/folder.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getFolders = asyncHandler(async (req, res) => {
  const folders = await folderService.getFolders(req.user._id);
  res.status(200).json(new ApiResponse(200, folders, 'Folders retrieved.'));
});

export const createFolder = asyncHandler(async (req, res) => {
  const { name, color } = req.body;
  const folder = await folderService.createFolder(req.user._id, name, color);
  res.status(201).json(new ApiResponse(201, folder, 'Folder created.'));
});

export const updateFolder = asyncHandler(async (req, res) => {
  const folder = await folderService.updateFolder(req.params.id, req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, folder, 'Folder updated.'));
});

export const deleteFolder = asyncHandler(async (req, res) => {
  await folderService.deleteFolder(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, null, 'Folder deleted.'));
});
