import { connectionData } from '@/services/mockData/connections.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const connectionService = {
  async getAll() {
    await delay(300);
    return [...connectionData];
  },

  async getById(id) {
    await delay(200);
    const connection = connectionData.find(c => c.Id === id);
    if (!connection) {
      throw new Error('Connection not found');
    }
    return { ...connection };
  },

  async getByWorkspaceId(workspaceId) {
    await delay(250);
    return connectionData.filter(c => c.workspaceId === workspaceId);
  }
};