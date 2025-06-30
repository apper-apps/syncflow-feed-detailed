import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { connectionService } from '@/services/api/connectionService';
import { workspaceService } from '@/services/api/workspaceService';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [workspaceFilter, setWorkspaceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterConnections();
  }, [connections, searchTerm, workspaceFilter, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [connectionsData, workspacesData] = await Promise.all([
        connectionService.getAll(),
        workspaceService.getAll()
      ]);
      setConnections(connectionsData);
      setWorkspaces(workspacesData);
    } catch (err) {
      setError('Failed to load connections');
      console.error('Connections error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterConnections = () => {
    let filtered = connections;

    if (searchTerm) {
      filtered = filtered.filter(connection =>
        connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        connection.sourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        connection.destinationName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (workspaceFilter !== 'all') {
      filtered = filtered.filter(connection => connection.workspaceId === workspaceFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(connection => connection.status === statusFilter);
    }

    setFilteredConnections(filtered);
  };

  const getConnectionTypeIcon = (sourceType, destinationType) => {
    const sourceIcons = {
      postgres: 'Database',
      mysql: 'Database',
      mongodb: 'Database',
      s3: 'HardDrive',
      gcs: 'Cloud',
      bigquery: 'BarChart3',
      snowflake: 'Snowflake'
    };

    return sourceIcons[sourceType?.toLowerCase()] || 'Network';
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connections</h1>
          <p className="text-gray-600">Browse and monitor your Airbyte connections</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="outline"
            icon="RefreshCw"
            onClick={loadData}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Network" className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Connections</p>
              <p className="text-2xl font-bold text-blue-900">{connections.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900">
                {connections.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Pause" className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Inactive</p>
              <p className="text-2xl font-bold text-yellow-900">
                {connections.filter(c => c.status === 'inactive').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Building2" className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Workspaces</p>
              <p className="text-2xl font-bold text-purple-900">{workspaces.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search connections..."
              className="w-full sm:w-64"
            />
            
            <select
              value={workspaceFilter}
              onChange={(e) => setWorkspaceFilter(e.target.value)}
              className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            >
              <option value="all">All Workspaces</option>
              {workspaces.map(workspace => (
                <option key={workspace.Id} value={workspace.Id}>
                  {workspace.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="deprecated">Deprecated</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            Showing {filteredConnections.length} of {connections.length} connections
          </div>
        </div>
      </Card>

      {/* Connections Grid */}
      {filteredConnections.length === 0 ? (
        <Empty
          title="No connections found"
          message={searchTerm || workspaceFilter !== 'all' || statusFilter !== 'all'
            ? "No connections match your current filters. Try adjusting your search criteria."
            : "No connections are available. Set up connections in your Airbyte workspace to see them here."
          }
          actionLabel="View Workspaces"
          onAction={() => window.open('https://cloud.airbyte.io', '_blank')}
          icon="Network"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredConnections.map((connection, index) => (
            <motion.div
              key={connection.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <ApperIcon 
                        name={getConnectionTypeIcon(connection.sourceType, connection.destinationType)} 
                        className="w-5 h-5 text-primary-600" 
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{connection.name}</h3>
                      <p className="text-sm text-gray-500">{connection.workspaceName}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={connection.status === 'active' ? 'success' : connection.status === 'inactive' ? 'warning' : 'default'}
                    size="small"
                  >
                    {connection.status}
                  </Badge>
                </div>

                {/* Connection Flow */}
                <div className="mb-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="Database" className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{connection.sourceName}</p>
                        <p className="text-xs text-gray-500">{connection.sourceType}</p>
                      </div>
                    </div>
                    
                    <ApperIcon name="ArrowRight" className="w-4 h-4 text-gray-400" />
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="Target" className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{connection.destinationName}</p>
                        <p className="text-xs text-gray-500">{connection.destinationType}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <ApperIcon name="Clock" className="w-3 h-3 mr-2" />
                    <span>Last sync: {connection.lastSync || 'Never'}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <ApperIcon name="BarChart3" className="w-3 h-3 mr-2" />
                    <span>Records synced: {connection.recordsSynced?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <ApperIcon name="Calendar" className="w-3 h-3 mr-2" />
                    <span>Created: {connection.createdAt || 'Unknown'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    {connection.frequency || 'Manual'}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="small"
                      icon="Play"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      title="Trigger sync"
                    />
                    <Button
                      variant="ghost"
                      size="small"
                      icon="ExternalLink"
                      className="text-gray-400 hover:text-gray-600"
                      title="View in Airbyte"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Connections;