import React from 'react';
import { Edit2, Trash2, RefreshCw, Globe, Clock, AlertCircle } from 'lucide-react';

interface Mock {
  id: number;
  path: string;
  method: string;
  response_status: number;
  created_at: string;
  updated_at: string;
}

interface MockListProps {
  mocks: Mock[];
  loading: boolean;
  onEdit: (mock: Mock) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
}

export const MockList: React.FC<MockListProps> = ({
  mocks,
  loading,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'PATCH': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 300 && status < 400) return 'text-yellow-600';
    if (status >= 400 && status < 500) return 'text-orange-600';
    if (status >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-slate-600">Loading mock endpoints...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Mock Endpoints</h2>
          <p className="text-slate-600 mt-1">
            Manage your API mock configurations ({mocks.length} endpoint{mocks.length !== 1 ? 's' : ''})
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Mock List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {mocks.length === 0 ? (
          <div className="p-12 text-center">
            <Globe className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No mock endpoints configured</h3>
            <p className="text-slate-500 mb-6">
              Create your first mock endpoint to start intercepting API requests.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900">Getting Started</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Click "Create Mock" to add your first endpoint configuration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {mocks.map((mock) => (
              <div key={mock.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColor(mock.method)}`}>
                        {mock.method}
                      </span>
                      <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-800">
                        {mock.path}
                      </code>
                      <span className={`text-sm font-medium ${getStatusColor(mock.response_status)}`}>
                        {mock.response_status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Created {new Date(mock.created_at).toLocaleDateString()}</span>
                      </div>
                      {mock.updated_at !== mock.created_at && (
                        <div className="flex items-center space-x-1">
                          <span>• Updated {new Date(mock.updated_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(mock)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit endpoint"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this mock endpoint?')) {
                          onDelete(mock.id);
                        }
                      }}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete endpoint"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};