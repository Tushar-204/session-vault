import { sharedLinkService } from '../services/sharedLink.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createShareLink = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const link = await sharedLinkService.createShareLink(req.user._id, workspaceId, req.body);
  res.status(201).json(new ApiResponse(201, link, 'Share link generated.'));
});

export const getSharedWorkspace = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const sharedData = await sharedLinkService.getSharedWorkspace(code);
  res.status(200).json(new ApiResponse(200, sharedData, 'Shared workspace retrieved.'));
});
