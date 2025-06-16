import React, { useState } from 'react';
import { Send, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { JsonEditor } from './JsonEditor';
import { mockApi } from '../api/mockApi';

export const EndpointTester: React.FC = () => {
  const [testData, setTestData] = useState({
    method: 'GET',
    path: '/api/test',
    headers: { 'Content-Type': 'application/json' },
    body: {}
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await mockApi.testEndpoint(testData);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Test failed');
    } finally {
      setLoading(false);
    }
  };

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600 bg-green-50';
    if (status >= 300 && status < 400) return 'text-yellow-600 bg-yellow-50';
    if (status >= 400 && status < 500) return 'text-orange-600 bg-orange-50';
    if (status >= 500) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Endpoint Tester</h2>
        <p className="text-slate-600 mt-1">
          Test your mock endpoints directly from the interface
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Request Configuration</h3>

          <form onSubmit={handleTest} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Method
                </label>
                <select
                  value={testData.method}
                  onChange={(e) => setTestData({ ...testData, method: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {methods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Path
                </label>
                <input
                  type="text"
                  value={testData.path}
                  onChange={(e) => setTestData({ ...testData, path: e.target.value })}
                  placeholder="/api/users/123"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Request Headers
              </label>
              <JsonEditor
                value={testData.headers}
                onChange={(value) => setTestData({ ...testData, headers: value })}
                placeholder='{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'
                className="h-32"
              />
            </div>

            {testData.method !== 'GET' && testData.method !== 'HEAD' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Request Body
                </label>
                <JsonEditor
                  value={testData.body}
                  onChange={(value) => setTestData({ ...testData, body: value })}
                  placeholder='{\n  "name": "John Doe",\n  "email": "john@example.com"\n}'
                  className="h-32"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{loading ? 'Testing...' : 'Send Request'}</span>
            </button>
          </form>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Response</h3>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-900">Test Failed</h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                <CheckCircle className="h-4 w-4" />
                <span>Status: {result.status}</span>
              </div>

              {result.headers && Object.keys(result.headers).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-2">Response Headers</h4>
                  <pre className="bg-slate-50 rounded-lg p-3 text-xs overflow-x-auto max-h-32">
                    {JSON.stringify(result.headers, null, 2)}
                  </pre>
                </div>
              )}

              {result.data && (
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-2">Response Body</h4>
                  <pre className="bg-slate-50 rounded-lg p-3 text-xs overflow-x-auto max-h-64">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {!result && !error && !loading && (
            <div className="text-center py-8">
              <Send className="h-8 w-8 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-500">Send a request to see the response</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
