import { executionData } from '@/services/mockData/executions.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const executionService = {
  async getAll() {
    await delay(300);
    return [...executionData];
  },

  async getById(id) {
    await delay(200);
    const execution = executionData.find(e => e.Id === id);
    if (!execution) {
      throw new Error('Execution not found');
    }
    return { ...execution };
  },

  async getByTaskId(taskId) {
    await delay(250);
    return executionData.filter(e => e.taskId === taskId);
  },

  async create(executionData) {
    await delay(400);
    const newExecution = {
      ...executionData,
      Id: Math.max(...executionData.map(e => e.Id)) + 1,
      startTime: new Date().toISOString(),
      status: 'running'
    };
    executionData.push(newExecution);
    return { ...newExecution };
  },

  async update(id, updates) {
    await delay(200);
    const index = executionData.findIndex(e => e.Id === id);
    if (index === -1) {
      throw new Error('Execution not found');
    }
    executionData[index] = {
      ...executionData[index],
      ...updates
    };
    return { ...executionData[index] };
  }
};