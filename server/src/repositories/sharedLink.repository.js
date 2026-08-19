import { SharedLink } from '../models/sharedLink.model.js';

export class SharedLinkRepository {
  async findByCode(shareCode) {
    return await SharedLink.findOne({ shareCode })
      .populate({
        path: 'workspaceId',
        select: 'title description color icon tags tabCount',
      })
      .populate('createdBy', 'fullName avatar');
  }

  async findByUser(userId) {
    return await SharedLink.find({ createdBy: userId })
      .populate({
        path: 'workspaceId',
        select: 'title description color icon tags tabCount',
      })
      .sort({ createdAt: -1 });
  }

  async create(sharedLinkData) {
    return await SharedLink.create(sharedLinkData);
  }

  async incrementViews(id) {
    return await SharedLink.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true });
  }

  async deleteByWorkspaceId(workspaceId, createdBy) {
    return await SharedLink.deleteMany({ workspaceId, createdBy });
  }
}

export const sharedLinkRepository = new SharedLinkRepository();
