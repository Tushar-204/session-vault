import { tabRepository } from '../repositories/tab.repository.js';
import { workspaceRepository } from '../repositories/workspace.repository.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const deleteTab = asyncHandler(async (req, res) => {
  const { tabId } = req.params;
  const deleted = await tabRepository.deleteById(tabId, req.user._id);

  if (deleted) {
    // Update tab count on workspace
    await workspaceRepository.updateById(deleted.workspaceId, req.user._id, {
      $inc: { tabCount: -1 },
    });
  }

  res.status(200).json(new ApiResponse(200, null, 'Tab deleted successfully.'));
});
