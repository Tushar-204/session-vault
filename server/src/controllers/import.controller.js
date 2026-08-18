import { workspaceService } from '../services/workspace.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const importSessions = asyncHandler(async (req, res) => {
  const { sessions } = req.body;

  if (!Array.isArray(sessions) || sessions.length === 0) {
    throw new ApiError(400, 'Invalid import data. Expected a non-empty sessions array.');
  }

  const importedWorkspaces = [];

  for (const session of sessions) {
    const workspace = await workspaceService.createWorkspace(req.user._id, session);
    importedWorkspaces.push(workspace);
  }

  res.status(201).json(
    new ApiResponse(201, { count: importedWorkspaces.length, workspaces: importedWorkspaces }, 'Sessions imported successfully.')
  );
});