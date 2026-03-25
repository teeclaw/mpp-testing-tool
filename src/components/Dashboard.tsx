'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api, DashboardStats, TestResult } from '@/lib/api';
import { Clock, CheckCircle, AlertCircle, Zap, PlayCircle, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTests: 0,
    successRate: 0,
    avgProcessingTime: 0,
  });
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());

  // Fetch stats and test results
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, resultsData] = await Promise.all([
        api.getStats(),
        api.getTestResults(10),
      ]);
      setStats(statsData);
      setTestResults(resultsData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Run a new test
  const handleRunTest = async () => {
    setIsRunning(true);
    try {
      const newTest = await api.runTest('Dashboard Test Run');
      // Refresh data immediately
      await fetchData();
    } catch (error) {
      console.error('Error running test:', error);
      alert('Failed to run test. Please check the backend connection.');
    } finally {
      setIsRunning(false);
    }
  };

  // Auto-refresh every 2 seconds
  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'running':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">MPP Testing Dashboard</h1>
          <p className="text-gray-600">
            Last updated: {lastUpdated} • Auto-refreshing every 2 seconds
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Tests Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                Total Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalTests}</div>
              <p className="text-xs text-gray-500 mt-1">All-time test executions</p>
            </CardContent>
          </Card>

          {/* Success Rate Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.successRate.toFixed(1)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.successRate}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* Avg Processing Time Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                Avg Processing Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stats.avgProcessingTime.toFixed(2)}ms
              </div>
              <p className="text-xs text-gray-500 mt-1">Average completion time</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Button and Results Section */}
        <div className="grid grid-cols-1 gap-6">
          {/* Run Test Button */}
          <Button
            onClick={handleRunTest}
            disabled={isRunning || loading}
            className="w-full h-12 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            {isRunning ? 'Running Test...' : 'Run Test'}
          </Button>

          {/* Recent Test Results */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Recent Test Results</CardTitle>
              <CardDescription>Last 10 executed tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {testResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No test results yet. Run a test to get started.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-gray-200">
                        <tr className="text-gray-600 font-semibold">
                          <th className="text-left py-3 px-4">Test Name</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Start Time</th>
                          <th className="text-left py-3 px-4">Duration (ms)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testResults.map((result) => (
                          <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 font-medium text-gray-900">{result.name}</td>
                            <td className="py-3 px-4">
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${getStatusColor(result.status)}`}>
                                {getStatusIcon(result.status)}
                                <span className="capitalize font-medium text-xs">{result.status}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(result.startTime).toLocaleTimeString()}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {result.processingTime ? result.processingTime.toFixed(2) : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Powered by Next.js • TypeScript • Tailwind CSS • Shadcn UI</p>
        </div>
      </div>
    </div>
  );
}
