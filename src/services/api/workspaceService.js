import { workspaceData } from '@/services/mockData/workspaces.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const workspaceService = {
  async getAll() {
    await delay(200);
    return [...workspaceData];
  },

  async getById(id) {
    await delay(150);
    const workspace = workspaceData.find(w => w.Id === id);
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    return { ...workspace };
  }
};