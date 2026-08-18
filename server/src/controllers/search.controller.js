import { workspaceRepository } from '../repositories/workspace.repository.js';
import { tabRepository } from '../repositories/tab.repository.js';
import { folderRepository } from '../repositories/folder.repository.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const searchAll = asyncHandler(async (req, res) => {
  const { q, scope = 'all', page = 1, limit = 12 } = req.query;

  if (!q || q.trim().length === 0) {
    throw new ApiError(400, 'Search query is required.');
  }

  const searchQuery = q.trim();
  const skip = (page - 1) * limit;

  let workspaces = [];
  let tabs = [];
  let folders = [];
  let totalWorkspaces = 0;
  let totalTabs = 0;
  let totalFolders = 0;

  if (scope === 'all' || scope === 'workspaces') {
    const wsResult = await workspaceRepository.findUserWorkspaces(req.user._id, {
      search: searchQuery,
      page,
      limit,
      isTrash: false,
    });
    workspaces = wsResult.workspaces;
    totalWorkspaces = wsResult.total;
  }

  if (scope === 'all' || scope === 'tabs') {
    const allTabs = await tabRepository.findByUserId(req.user._id);
    const filtered = allTabs.filter(
      (tab) =>
        tab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tab.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
    totalTabs = filtered.length;
    tabs = filtered.slice(skip, skip + limit);
  }

  if (scope === 'all' || scope === 'folders') {
    const allFolders = await folderRepository.findByUserId(req.user._id);
    const filtered = allFolders.filter((folder) =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    totalFolders = filtered.length;
    folders = filtered.slice(skip, skip + limit);
  }

  const results = {
    workspaces: scope === 'all' || scope === 'workspaces' ? workspaces : [],
    tabs: scope === 'all' || scope === 'tabs' ? tabs : [],
    folders: scope === 'all' || scope === 'folders' ? folders : [],
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalItems: totalWorkspaces + totalTabs + totalFolders,
      totalWorkspaces,
      totalTabs,
      totalFolders,
    },
  };

  res.status(200).json(new ApiResponse(200, results, 'Search results retrieved.'));
});

export const searchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(200).json(new ApiResponse(200, { workspaces: [], tabs: [], folders: [] }, 'No suggestions.'));
  }

  const searchQuery = q.trim().toLowerCase();

  const wsResult = await workspaceRepository.findUserWorkspaces(req.user._id, {
    search: searchQuery,
    limit: 5,
    isTrash: false,
  });

  const allTabs = await tabRepository.findByUserId(req.user._id);
  const matchingTabs = allTabs
    .filter((tab) => tab.title.toLowerCase().includes(searchQuery) || tab.url.toLowerCase().includes(searchQuery))
    .slice(0, 5);

  const allFolders = await folderRepository.findByUserId(req.user._id);
  const matchingFolders = allFolders.filter((folder) => folder.name.toLowerCase().includes(searchQuery)).slice(0, 5);

  res.status(200).json(
    new ApiResponse(200, { workspaces: wsResult.workspaces, tabs: matchingTabs, folders: matchingFolders }, 'Suggestions retrieved.')
  );
});