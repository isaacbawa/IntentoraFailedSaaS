import React from 'react';
import { TrendingDown, BarChart3, AlertTriangle, Code, DollarSign, Calendar } from 'lucide-react';
import { FailureAnalytics } from '../utils/analytics';

interface MonthlyReportProps {
  analytics: FailureAnalytics;
  month: string;
  year: number;
}

const MonthlyReport = ({ analytics, month, year }: MonthlyReportProps) => {
  const reportDate = `${month} ${year}`;

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">SaaS Graveyard Trends Report</h1>
        <p className="text-red-100 text-lg">{reportDate}</p>
        <p className="text-red-200 text-sm mt-2">
          Aggregated insights from {analytics.topFailureReasons.reduce((sum, reason) => sum + reason.count, 0)} documented failures
        </p>
      </div>

      <div className="p-8 space-y-8">
        {/* Executive Summary */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-6 w-6 text-red-500 mr-2" />
            Executive Summary
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed">
              This month's analysis reveals critical patterns in SaaS failures. The top failure reason remains
              <strong> {analytics.topFailureReasons[0]?.reason}</strong>, affecting {analytics.topFailureReasons[0]?.percentage}%
              of documented cases. Startups in the {analytics.industryBreakdown[0]?.industry} sector continue to show
              the highest failure rates, while red flags like "Unsustainable Unit Economics\" correlate with
              85% of failures.
            </p>
          </div>
        </section>

        {/* Most Common Failure Causes */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingDown className="h-6 w-6 text-red-500 mr-2" />
            Most Common Failure Causes
          </h2>
          <div className="space-y-4">
            {analytics.topFailureReasons.slice(0, 5).map((reason, index) => (
              <div key={index} className="border-l-4 border-red-500 pl-4 bg-red-50 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">#{index + 1} {reason.reason}</h3>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    {reason.percentage}% of failures
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Affected {reason.count} startups including: {reason.examples.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Analysis */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Code className="h-6 w-6 text-blue-500 mr-2" />
            Tech Stack Failure Patterns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.techStackAnalysis.map((tech, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{tech.stack}</h3>
                  <span className="text-blue-600 font-medium">{tech.count} failures</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${tech.failureRate}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{tech.failureRate}% of documented failures</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Strategy Patterns */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <DollarSign className="h-6 w-6 text-green-500 mr-2" />
            Pricing Strategy Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.pricingPatterns.map((pattern, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{pattern.strategy}</h3>
                  <span className="text-gray-600">{pattern.count} cases</span>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${pattern.successRate > 30 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {pattern.successRate}% success rate
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Critical Red Flags */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-6 w-6 text-amber-500 mr-2" />
            Critical Red Flags to Avoid
          </h2>
          <div className="space-y-4">
            {analytics.redFlags.map((flag, index) => (
              <div key={index} className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{flag.flag}</h3>
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold">
                    {flag.correlation}% failure correlation
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{flag.description}</p>
                <p className="text-sm text-gray-600">
                  <strong>Warning signs seen in:</strong> {flag.examples.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Self-Assessment Checklist */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Self-Assessment Checklist</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              <strong>Rate your startup against these critical factors:</strong>
            </p>
            <div className="space-y-3">
              {[
                'Do you have sustainable unit economics (LTV > 3x CAC)?',
                'Have you achieved clear product-market fit with paying customers?',
                'Is your customer acquisition cost trending downward?',
                'Do you have domain expertise in your target market?',
                'Are you compliant with all relevant regulations?',
                'Can you survive 12+ months without additional funding?',
                'Do you have less than 3 major pivots in the last 6 months?'
              ].map((question, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-4 h-4 border border-gray-400 rounded mr-3 mt-0.5"></div>
                  <span className="text-gray-700">{question}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4 italic">
              If you answered "no" to 3+ questions, consider addressing these issues before scaling.
            </p>
          </div>
        </section>

        {/* Footer */}
        <section className="border-t border-gray-200 pt-6">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              <strong>Failed SaaS Teardowns</strong> - Learn from $1B+ in documented failures
            </p>
            <p className="text-sm">
              Report generated on {new Date().toLocaleDateString()} •
              Data sourced from {analytics.topFailureReasons.reduce((sum, reason) => sum + reason.count, 0)} verified startup failures
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MonthlyReport;