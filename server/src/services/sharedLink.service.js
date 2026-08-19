import crypto from 'crypto';
import { sharedLinkRepository } from '../repositories/sharedLink.repository.js';
import { workspaceService } from './workspace.service.js';
import { ApiError } from '../utils/ApiError.js';

export class SharedLinkService {
  async createShareLink(userId, workspaceId, options = {}) {
    const shareCode = crypto.randomBytes(6).toString('hex');

    const link = await sharedLinkRepository.create({
      workspaceId,
      createdBy: userId,
      shareCode,
      accessLevel: options.accessLevel || 'view',
      expiresAt: options.expiresInDays ? new Date(Date.now() + options.expiresInDays * 86400000) : null,
    });

    return link;
  }

  async listUserLinks(userId) {
    return await sharedLinkRepository.findByUser(userId);
  }

  async getSharedWorkspace(shareCode) {
    const link = await sharedLinkRepository.findByCode(shareCode);

    if (!link) {
      throw new ApiError(404, 'Shared session link not found or expired.');
    }

    if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
      throw new ApiError(410, 'This shared session link has expired.');
    }

    await sharedLinkRepository.incrementViews(link._id);

    const workspaceData = await workspaceService.getWorkspaceDetails(
      link.workspaceId._id,
      link.createdBy._id
    );

    return {
      sharedInfo: {
        shareCode: link.shareCode,
        accessLevel: link.accessLevel,
        createdBy: link.createdBy.fullName,
        createdAt: link.createdAt,
      },
      workspace: workspaceData,
    };
  }
}

export const sharedLinkService = new SharedLinkService();
