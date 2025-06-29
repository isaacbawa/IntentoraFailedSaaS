// import React, { useMemo } from 'react';
// import { BarChart3, Mail } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import FailureAnalyticsComponent from '../components/FailureAnalytics';
// import { calculateFailureAnalytics } from '../utils/analytics';
// import teardownsData from '/public/data/teardowns.json';

// const Analytics = () => {
//   const analytics = useMemo(() => {
//     return calculateFailureAnalytics(teardownsData);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <BarChart3 className="h-16 w-16 text-red-600 mx-auto mb-6" />
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Startup Failure Analytics
//           </h1>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Data-driven insights from 1000+ real startup failures. Identify patterns,
//             avoid red flags, and learn from $10.2B+ in documented mistakes.
//           </p>
//           {/* <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Data-driven insights from {teardownsData.length}+ real startup failures. Identify patterns,
//             avoid red flags, and learn from $10.2B+ in documented mistakes.
//           </p> ## Todo Use this dynamic one when the real number of stories/teardown is enough*/}
//         </div>

//         {/* Analytics Content */}
//         <FailureAnalyticsComponent analytics={analytics} />

//         {/* Newsletter CTA */}
//         <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-center text-white mt-12">
//           <h2 className="text-2xl font-bold mb-4">
//             Get These Insights Weekly
//           </h2>
//           <p className="text-red-100 mb-6 max-w-2xl mx-auto">
//             Don't just read the data once. Get weekly failure analysis and trends
//             delivered to your inbox to stay ahead of common startup pitfalls.
//           </p>
//           <Link
//             to="/newsletter"
//             className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
//           >
//             <Mail className="mr-2 h-5 w-5" />
//             Join the Newsletter
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analytics;



import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import FailureAnalyticsComponent from '../components/FailureAnalytics';
import { calculateFailureAnalytics } from '../utils/analytics';

const DATA_VERSION = 'v2'; // Increment when JSON structure or content changes
const storedVersion = localStorage.getItem('dataVersion');

if (storedVersion !== DATA_VERSION) {
  localStorage.removeItem('teardowns'); // or clear() if needed
  localStorage.setItem('dataVersion', DATA_VERSION);
}

const Analytics = () => {
  const [teardowns, setTeardowns] = useState([]);

  // Fetch teardowns dynamically from public folder
  useEffect(() => {
    const loadTeardowns = async () => {
      try {
        const response = await fetch('/data/teardowns.json?ts=' + Date.now()); // Cache-busting
        const data = await response.json();
        setTeardowns(data);
      } catch (error) {
        console.error('Failed to load teardowns:', error);
      }
    };

    loadTeardowns();
  }, []);

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
            Data-driven insights from {teardowns.length}+ real startup failures. Identify patterns,
            avoid red flags, and learn from billions in documented mistakes.
          </p>
        </div>

        {/* Analytics Content */}
        {analytics ? (
          <FailureAnalyticsComponent analytics={analytics} />
        ) : (
          <p className="text-center text-gray-500">Loading analytics...</p>
        )}

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-center text-white mt-12">
          <h2 className="text-2xl font-bold mb-4">
            Get These Insights Weekly
          </h2>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            Don’t just read the data once. Get weekly failure analysis and trends
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
      </div>
    </div>
  );
};

export default Analytics;
