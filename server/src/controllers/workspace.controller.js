import { workspaceService } from '../services/workspace.service.js';
import { workspaceRepository } from '../repositories/workspace.repository.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createWorkspace = asyncHandler(async (req, res) => {
  const workspace = await workspaceService.createWorkspace(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, workspace, 'Workspace created successfully.'));
});

export const getWorkspaces = asyncHandler(async (req, res) => {
  const options = {
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 12,
    search: req.query.search || '',
    isFavorite: req.query.favorite === 'true',
    isPinned: req.query.pinned === 'true',
    isTrash: req.query.trash === 'true',
    folderId: req.query.folderId || null,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc',
  };

  const result = await workspaceService.listWorkspaces(req.user._id, options);

  const meta = {
    page: result.page,
    limit: result.limit,
    totalItems: result.total,
    totalPages: result.totalPages,
    hasNextPage: result.page < result.totalPages,
    hasPrevPage: result.page > 1,
  };

  res.status(200).json(new ApiResponse(200, result.workspaces, 'Workspaces retrieved.', meta));
});

export const getWorkspaceById = asyncHandler(async (req, res) => {
  const workspace = await workspaceService.getWorkspaceDetails(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, workspace, 'Workspace details fetched.'));
});

export const updateWorkspace = asyncHandler(async (req, res) => {
  const updated = await workspaceService.updateWorkspace(req.params.id, req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, updated, 'Workspace updated.'));
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const updated = await workspaceService.toggleFavorite(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, updated, 'Favorite status toggled.'));
});

export const moveToTrash = asyncHandler(async (req, res) => {
  await workspaceService.moveToTrash(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, null, 'Workspace moved to trash.'));
});

export const restoreFromTrash = asyncHandler(async (req, res) => {
  await workspaceService.restoreFromTrash(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, null, 'Workspace restored from trash.'));
});

export const deletePermanently = asyncHandler(async (req, res) => {
  await workspaceService.deletePermanently(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, null, 'Workspace permanently deleted.'));
});

export const exportSession = asyncHandler(async (req, res) => {
  const exportData = await workspaceService.exportSession(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, exportData, 'Session exported successfully.'));
});

export const getAnalyticsStats = asyncHandler(async (req, res) => {
  const stats = await workspaceRepository.getUserAnalyticsStats(req.user._id);
  res.status(200).json(new ApiResponse(200, stats, 'User analytics stats fetched.'));
});
