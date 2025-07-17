import React, { useMemo } from 'react';
import { BarChart3, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import FailureAnalyticsComponent from '../components/FailureAnalytics';
import { calculateFailureAnalytics } from '../utils/analytics';
import { useTeardowns } from '../hooks/useSupabaseData';

const Analytics = () => {
  const { teardowns, loading, error } = useTeardowns();

  const analytics = useMemo(() => {
    if (teardowns.length === 0) return null;
    return calculateFailureAnalytics(teardowns);
  }, [teardowns]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <BarChart3 className="h-16 w-16 text-red-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Startup Failure Analytics
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Data-driven insights from 1000+ real startup failures. Identify patterns,
            avoid red flags, and learn from billions in documented mistakes.
          </p>
          {/* <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Data-driven insights from {teardowns.length}+ real startup failures. Identify patterns,
            avoid red flags, and learn from billions in documented mistakes.
          </p> ## Todo*/}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-red-600 hover:text-red-700 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Analytics Content */}
        {!loading && !error && analytics ? (
          <FailureAnalyticsComponent analytics={analytics} />
        ) : !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500">No data available for analytics</p>
          </div>
        )}

        {/* Newsletter CTA */}
        {!loading && !error && (
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-center text-white mt-12">
            <h2 className="text-2xl font-bold mb-4">
              Get These Insights Weekly
            </h2>
            <p className="text-red-100 mb-6 max-w-2xl mx-auto">
              Don't just read the data once. Get weekly failure analysis and trends
              delivered to your inbox to stay ahead of common startup pitfalls.
            </p>
            <Link
              to="/newsletter"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              <Mail className="mr-2 h-5 w-5" />
              Join the Newsletter
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
