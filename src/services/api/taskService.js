import { taskData } from '@/services/mockData/tasks.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...taskData];
  },

  async getById(id) {
    await delay(200);
    const task = taskData.find(t => t.Id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(500);
    const newTask = {
      ...taskData,
      Id: Math.max(...taskData.map(t => t.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastRun: null
    };
    taskData.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(300);
    const index = taskData.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    taskData[index] = {
      ...taskData[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...taskData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = taskData.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    taskData.splice(index, 1);
    return { success: true };
  },

  async runTask(id) {
    await delay(400);
    const task = taskData.find(t => t.Id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    // Update task status to running
    task.status = 'running';
    task.lastRun = new Date().toISOString();
return { success: true };
  },

async runMultipleTasks(taskIds) {
    await delay(600);
    
    // Use Promise.all for parallel execution
    const promises = taskIds.map(async (taskId) => {
      try {
        const task = taskData.find(t => t.Id === taskId);
        if (!task) {
          return { taskId, success: false, error: 'Task not found' };
        }
        
        // Simulate parallel execution
        await delay(Math.random() * 200 + 100); // Random delay 100-300ms
        
        // Update task status to running
        task.status = 'running';
        task.lastRun = new Date().toISOString();
        
        return { taskId, success: true };
      } catch (error) {
        return { taskId, success: false, error: error.message };
      }
    });
    
    const results = await Promise.all(promises);
    return results;
  }
};