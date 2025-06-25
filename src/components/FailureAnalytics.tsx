import React from 'react';
import { TrendingDown, BarChart3, AlertTriangle, Target, DollarSign, Code } from 'lucide-react';
import { FailureAnalytics } from '../utils/analytics';

interface FailureAnalyticsProps {
  analytics: FailureAnalytics;
}

const FailureAnalyticsComponent = ({ analytics }: FailureAnalyticsProps) => {
  return (
    <div className="space-y-8">
      {/* Top Failure Reasons */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingDown className="h-6 w-6 text-red-500 mr-2" />
          Top Reasons for Startup Failures
        </h2>
        <div className="space-y-4">
          {analytics.topFailureReasons.map((reason, index) => (
            <div key={index} className="border-l-4 border-red-500 pl-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{reason.reason}</h3>
                <div className="flex items-center space-x-2">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    {reason.count} cases
                  </span>
                  <span className="text-gray-600 text-sm">{reason.percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${reason.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                Examples: {reason.examples.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Analysis */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Code className="h-6 w-6 text-blue-500 mr-2" />
          Tech Stack Failure Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics.techStackAnalysis.map((tech, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{tech.stack}</h3>
                <span className="text-gray-600 text-sm">{tech.count} failures</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${tech.failureRate}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{tech.failureRate}% of total failures</p>
            </div>
          ))}
        </div>
      </div>

      {/* Red Flags */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <AlertTriangle className="h-6 w-6 text-amber-500 mr-2" />
          Critical Red Flags
        </h2>
        <div className="space-y-4">
          {analytics.redFlags.map((flag, index) => (
            <div key={index} className="border border-amber-200 rounded-lg p-4 bg-amber-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{flag.flag}</h3>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold">
                  {flag.correlation}% correlation
                </span>
              </div>
              <p className="text-gray-700 mb-2">{flag.description}</p>
              <p className="text-sm text-gray-600">
                <strong>Examples:</strong> {flag.examples.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Industry Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="h-6 w-6 text-green-500 mr-2" />
          Industry Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.industryBreakdown.map((industry, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{industry.industry}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Failures:</strong> {industry.count}</p>
                <p><strong>Avg Duration:</strong> {industry.avgDuration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Range Analysis */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <DollarSign className="h-6 w-6 text-purple-500 mr-2" />
          Failure by Revenue Range
        </h2>
        <div className="space-y-4">
          {analytics.revenueRangeAnalysis.map((range, index) => (
            <div key={index} className="border-l-4 border-purple-500 pl-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{range.range}</h3>
                <span className="text-gray-600 text-sm">{range.count} failures</span>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Common reasons:</strong> {range.commonReasons.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FailureAnalyticsComponent;