import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { mockApi } from '../api/mockApi';

interface RequestLog {
  id: number;
  method: string;
  path: string;
  headers: any;
  body: any;
  response_status: number;
  response_body: any;
  matched_mock_id: number | null;
  timestamp: string;
  mock_path?: string;
  mock_method?: string;
}

export const RequestLogs: React.FC = () => {
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<RequestLog | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getRequestLogs(100);
      setLogs(data);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = async () => {
    if (!confirm('Are you sure you want to clear all request logs?')) return;
    
    try {
      await mockApi.clearLogs();
      setLogs([]);
      setSelectedLog(null);
    } catch (error) {
      console.error('Error clearing logs:', error);
    }
  };

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
          <span className="ml-2 text-slate-600">Loading request logs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Request Logs</h2>
          <p className="text-slate-600 mt-1">
            Monitor incoming requests and their responses ({logs.length} request{logs.length !== 1 ? 's' : ''})
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          {logs.length > 0 && (
            <button
              onClick={clearLogs}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logs List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Recent Requests</h3>
          </div>
          
          {logs.length === 0 ? (
            <div className="p-8 text-center">
              <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No requests logged</h3>
              <p className="text-slate-500">
                Request logs will appear here when clients make requests to your mock endpoints.
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                    selectedLog?.id === log.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getMethodColor(log.method)}`}>
                        {log.method}
                      </span>
                      <code className="text-sm font-mono text-slate-700">{log.path}</code>
                    </div>
                    <div className="flex items-center space-x-2">
                      {log.matched_mock_id ? (
                        <CheckCircle className="h-4 w-4 text-green-500" title="Matched mock endpoint" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-500" title="No mock endpoint matched" />
                      )}
                      <span className={`text-sm font-medium ${getStatusColor(log.response_status)}`}>
                        {log.response_status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    {log.matched_mock_id && (
                      <span className="text-green-600">• Matched Mock</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Log Details */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Request Details</h3>
          </div>
          
          {selectedLog ? (
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-2">Request Info</h4>
                <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Method & Path:</span>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getMethodColor(selectedLog.method)}`}>
                        {selectedLog.method}
                      </span>
                      <code className="text-sm font-mono">{selectedLog.path}</code>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status:</span>
                    <span className={`text-sm font-medium ${getStatusColor(selectedLog.response_status)}`}>
                      {selectedLog.response_status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Timestamp:</span>
                    <span className="text-sm">{new Date(selectedLog.timestamp).toLocaleString()}</span>
                  </div>
                  {selectedLog.matched_mock_id && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Mock Matched:</span>
                      <span className="text-sm text-green-600 flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Yes</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {Object.keys(selectedLog.headers).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-2">Request Headers</h4>
                  <pre className="bg-slate-50 rounded-lg p-3 text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.headers, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.body && (
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-2">Request Body</h4>
                  <pre className="bg-slate-50 rounded-lg p-3 text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.body, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.response_body && (
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-2">Response Body</h4>
                  <pre className="bg-slate-50 rounded-lg p-3 text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.response_body, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Activity className="h-8 w-8 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-500">Select a request from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};