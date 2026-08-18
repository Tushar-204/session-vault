import { Tab } from '../models/tab.model.js';

export class TabRepository {
  async findByWorkspaceId(workspaceId) {
    return await Tab.find({ workspaceId }).sort({ index: 1 });
  }

  async bulkCreate(tabs) {
    return await Tab.insertMany(tabs);
  }

  async deleteByWorkspaceId(workspaceId) {
    return await Tab.deleteMany({ workspaceId });
  }

  async deleteById(tabId, userId) {
    return await Tab.findOneAndDelete({ _id: tabId, userId });
  }

  async countByUserId(userId) {
    return await Tab.countDocuments({ userId });
  }

  async findByUserId(userId) {
    return await Tab.find({ userId }).sort({ createdAt: -1 });
  }
}

export const tabRepository = new TabRepository();
