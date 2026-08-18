import { Workspace } from '../models/workspace.model.js';

export class WorkspaceRepository {
  async findById(id) {
    return await Workspace.findById(id).populate('folderId', 'name color');
  }

  async findUserWorkspaces(userId, options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      isFavorite = false,
      isPinned = false,
      isTrash = false,
      folderId = null,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const query = { userId, isTrash };

    if (isFavorite) query.isFavorite = true;
    if (isPinned) query.isPinned = true;
    if (folderId) query.folderId = folderId;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [workspaces, total] = await Promise.all([
      Workspace.find(query)
        .populate('folderId', 'name color')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Workspace.countDocuments(query),
    ]);

    return {
      workspaces,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(workspaceData) {
    return await Workspace.create(workspaceData);
  }

  async updateById(id, userId, updateData) {
    return await Workspace.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );
  }

  async deleteById(id, userId) {
    return await Workspace.findOneAndDelete({ _id: id, userId });
  }

  async getUserAnalyticsStats(userId) {
    const totalWorkspaces = await Workspace.countDocuments({ userId, isTrash: false });
    const favoriteCount = await Workspace.countDocuments({ userId, isFavorite: true, isTrash: false });
    const trashCount = await Workspace.countDocuments({ userId, isTrash: true });
    
    return {
      totalWorkspaces,
      favoriteCount,
      trashCount,
    };
  }
}

export const workspaceRepository = new WorkspaceRepository();
