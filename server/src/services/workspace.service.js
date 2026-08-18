import { workspaceRepository } from '../repositories/workspace.repository.js';
import { tabRepository } from '../repositories/tab.repository.js';
import { ApiError } from '../utils/ApiError.js';

export class WorkspaceService {
  async createWorkspace(userId, workspaceData) {
    const { title, description, color, icon, tags, folderId, tabs = [] } = workspaceData;

    const workspace = await workspaceRepository.create({
      userId,
      title,
      description,
      color: color || '#3b82f6',
      icon: icon || 'Folder',
      tags: tags || [],
      folderId: folderId || null,
      tabCount: tabs.length,
    });

    if (tabs.length > 0) {
      const tabsToInsert = tabs.map((tab, idx) => ({
        workspaceId: workspace._id,
        userId,
        title: tab.title || 'Untitled Tab',
        url: tab.url,
        favIconUrl: tab.favIconUrl || 'https://www.google.com/s2/favicons?domain=google.com&sz=64',
        index: tab.index !== undefined ? tab.index : idx,
        pinned: tab.pinned || false,
        windowId: tab.windowId || 'default',
      }));

      await tabRepository.bulkCreate(tabsToInsert);
    }

    const fullWorkspace = await workspaceRepository.findById(workspace._id);
    const createdTabs = await tabRepository.findByWorkspaceId(workspace._id);

    return {
      ...fullWorkspace.toObject(),
      tabs: createdTabs,
    };
  }

  async getWorkspaceDetails(workspaceId, userId) {
    const workspace = await workspaceRepository.findById(workspaceId);
    if (!workspace || workspace.userId.toString() !== userId.toString()) {
      throw new ApiError(404, 'Workspace not found or access denied.');
    }

    const tabs = await tabRepository.findByWorkspaceId(workspaceId);

    return {
      ...workspace.toObject(),
      tabs,
    };
  }

  async listWorkspaces(userId, options) {
    return await workspaceRepository.findUserWorkspaces(userId, options);
  }

  async updateWorkspace(workspaceId, userId, updateData) {
    const updated = await workspaceRepository.updateById(workspaceId, userId, updateData);
    if (!updated) {
      throw new ApiError(404, 'Workspace not found.');
    }
    return updated;
  }

  async toggleFavorite(workspaceId, userId) {
    const workspace = await workspaceRepository.findById(workspaceId);
    if (!workspace || workspace.userId.toString() !== userId.toString()) {
      throw new ApiError(404, 'Workspace not found.');
    }

    return await workspaceRepository.updateById(workspaceId, userId, {
      isFavorite: !workspace.isFavorite,
    });
  }

  async moveToTrash(workspaceId, userId) {
    return await workspaceRepository.updateById(workspaceId, userId, {
      isTrash: true,
      trashDate: new Date(),
    });
  }

  async restoreFromTrash(workspaceId, userId) {
    return await workspaceRepository.updateById(workspaceId, userId, {
      isTrash: false,
      trashDate: null,
    });
  }

  async deletePermanently(workspaceId, userId) {
    await tabRepository.deleteByWorkspaceId(workspaceId);
    return await workspaceRepository.deleteById(workspaceId, userId);
  }

  async exportSession(workspaceId, userId) {
    const workspace = await this.getWorkspaceDetails(workspaceId, userId);
    return {
      appName: 'SessionVault',
      exportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      session: {
        title: workspace.title,
        description: workspace.description,
        color: workspace.color,
        tags: workspace.tags,
        tabs: workspace.tabs.map((t) => ({
          title: t.title,
          url: t.url,
          favIconUrl: t.favIconUrl,
          pinned: t.pinned,
        })),
      },
    };
  }
}

export const workspaceService = new WorkspaceService();
