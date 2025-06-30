import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import QuickActions from "@/components/molecules/QuickActions";
import SearchBar from "@/components/molecules/SearchBar";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { taskService } from "@/services/api/taskService";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, statusFilter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleRunTask = async (taskId) => {
    try {
      await taskService.runTask(taskId);
      toast.success('Task execution started successfully');
      loadTasks();
    } catch (err) {
      toast.error('Failed to start task execution');
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      const newStatus = task.status === 'disabled' ? 'enabled' : 'disabled';
      await taskService.update(taskId, { status: newStatus });
      toast.success(`Task ${newStatus} successfully`);
      loadTasks();
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(taskId);
        toast.success('Task deleted successfully');
        loadTasks();
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
};

  const handleRunMultipleTasks = async (taskIds) => {
    try {
      toast.info(`Starting ${taskIds.length} tasks in parallel...`);
      const results = await taskService.runMultipleTasks(taskIds);
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      if (failed === 0) {
        toast.success(`All ${successful} tasks started successfully`);
      } else {
        toast.warning(`${successful} tasks started, ${failed} failed`);
      }
      loadTasks();
    } catch (err) {
      toast.error('Failed to start parallel task execution');
    }
  };
  const handleBulkAction = async (action) => {
    if (selectedTasks.length === 0) {
      toast.warning('Please select tasks to perform bulk action');
      return;
    }

    try {
      for (const taskId of selectedTasks) {
        if (action === 'enable') {
          await taskService.update(taskId, { status: 'enabled' });
        } else if (action === 'disable') {
          await taskService.update(taskId, { status: 'disabled' });
        } else if (action === 'delete') {
          await taskService.delete(taskId);
        }
      }
      toast.success(`Bulk ${action} completed successfully`);
      setSelectedTasks([]);
      loadTasks();
    } catch (err) {
      toast.error(`Failed to perform bulk ${action}`);
    }
  };

  const handleSelectTask = (taskId) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTasks(
      selectedTasks.length === filteredTasks.length
        ? []
        : filteredTasks.map(task => task.Id)
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-600">Manage your sync orchestration tasks</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            as={Link}
            to="/tasks/create"
            variant="primary"
            icon="Plus"
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full sm:w-64"
            />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
              <option value="running">Running</option>
              <option value="failed">Failed</option>
            </select>
          </div>

{selectedTasks.length > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="info" className="mr-2">
                {selectedTasks.length} selected
              </Badge>
              <Button
                variant="ghost"
                size="small"
                icon="PlayCircle"
                onClick={() => handleRunMultipleTasks(selectedTasks)}
                className="text-purple-600 hover:text-purple-700"
              >
                Run Selected
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={() => handleBulkAction('enable')}
              >
                Enable
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={() => handleBulkAction('disable')}
              >
                Disable
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={() => handleBulkAction('delete')}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          message={searchTerm || statusFilter !== 'all' 
            ? "No tasks match your current filters. Try adjusting your search criteria."
            : "Create your first sync orchestration task to get started with automating your Airbyte pipelines."
          }
          actionLabel="Create Task"
          onAction={() => window.location.href = '/tasks/create'}
          icon="ListTodo"
        />
      ) : (
        <div className="space-y-4">
          {/* Select All */}
          <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={selectedTasks.length === filteredTasks.length}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600">
              Select all ({filteredTasks.length} tasks)
            </span>
          </div>

          {/* Task Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.Id)}
                        onChange={() => handleSelectTask(task.Id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <Link
                          to={`/tasks/${task.Id}`}
                          className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                        >
                          {task.name}
                        </Link>
                      </div>
                    </div>
                    <StatusIndicator status={task.status} size="small" />
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <ApperIcon name="Clock" className="w-3 h-3 mr-2" />
                      <span>Schedule: {task.cronSchedule}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <ApperIcon name="Network" className="w-3 h-3 mr-2" />
                      <span>{task.connections?.length || 0} connections</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <ApperIcon name="Calendar" className="w-3 h-3 mr-2" />
                      <span>Created {format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    {task.webhookUrl && (
                      <div className="flex items-center text-xs text-gray-500">
                        <ApperIcon name="Webhook" className="w-3 h-3 mr-2" />
                        <span>Webhook configured</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      Last run: {task.lastRun ? format(new Date(task.lastRun), 'MMM d, HH:mm') : 'Never'}
                    </div>
                    <QuickActions
                      task={task}
                      onRun={handleRunTask}
                      onToggle={handleToggleTask}
                      onEdit={(id) => window.location.href = `/tasks/${id}`}
                      onDelete={handleDeleteTask}
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;