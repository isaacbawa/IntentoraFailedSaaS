import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TeardownSideBar from '../components/TeardownSideBar';
import { useTeardown, useTeardowns, useStats } from '../hooks/useSupabaseData';
import {
  ArrowLeft,
  TrendingDown,
  DollarSign,
  Clock,
  ExternalLink,
  Target,
  AlertTriangle,
  Mail,
  ArrowRight,
  Image as ImageIcon
} from 'lucide-react';

const TeardownDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { teardown, loading: teardownLoading, error: teardownError } = useTeardown(id || '');
  const { teardowns: relatedTeardowns } = useTeardowns();
  const { stats } = useStats();

  if (!teardown) {
    if (teardownLoading) {
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading story...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-0 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {teardownError || 'Story Not Found'}
          </h1>
          <Link to="/failure-stories" className="text-red-600 hover:text-red-700">
            ← Back to Failure Stories
          </Link>
        </div>
      </div>
    );
  }

  const related = relatedTeardowns
    .filter(t => t.id !== teardown.id && t.tags.some(tag => teardown.tags.includes(tag)))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-0 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/failure-stories"
          className="inline-flex items-center text-red-600 hover:text-red-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Failure Stories
        </Link>
        <div className='flex max-w-7xl mx-0 pl-4 pr-0 sm:pl-6 sm:pr-0 lg:pl-8 lg:pr-0 max-sm:grid max-md:grid'>
          <div className='max-w-[750px] ml-8 mr-20'>
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{teardown.name}</h1>
                    {teardown.images && teardown.images.length > 0 && (
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xl text-gray-600 mb-4">{teardown.short_description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {teardown.duration}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {teardown.revenue}
                    </span>
                    <span className="overflow-hidden bg-red-100 text-red-800 px-3 py-1 sm:rounded-lg lg:rounded-xl text-xs font-medium">
                      {teardown.market}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {teardown.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Images */}
            {teardown.images && teardown.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <ImageIcon className="h-5 w-5 text-gray-500 mr-2" />
                  Screenshots & Images
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teardown.images.map((image, index) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${teardown.name} screenshot ${index + 1}`}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Analysis</h2>
              <p className="text-gray-700 leading-relaxed">{teardown.detailed_summary}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Why It Failed */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                  Why It Failed
                </h2>
                <ul className="space-y-3">
                  {teardown.failure_reasons.map((reason, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lessons Learned */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 text-green-500 mr-2" />
                  Lessons Learned
                </h2>
                <ul className="space-y-3">
                  {teardown.lessons_learned.map((lesson, index) => (
                    <li key={index} className="flex items-start">
                      <Target className="h-4 w-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{lesson}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Current Venture Link */}
            {teardown.current_venture_url && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Current Venture</h2>
                <a
                  href={teardown.current_venture_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-red-600 hover:text-red-700"
                >
                  {teardown.current_venture_name}
                  {/* <ExternalLink className="h-4 w-4 ml-2" /> */}
                </a>
              </div>
            )}

            {/* Source Link */}
            {teardown.source_url && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Original Source</h2>
                <a
                  href={teardown.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-red-600 hover:text-red-700"
                >
                  Read the original postmortem
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </div>
            )}

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-center text-white mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Want More Insights Like This?
              </h2>
              <p className="text-red-100 mb-6 max-w-2xl mx-auto">
                Get a detailed startup failure analysis delivered to your inbox every week.
                Don't repeat the same expensive mistakes.
              </p>
              <Link
                to="/newsletter"
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
              >
                <Mail className="mr-2 h-5 w-5" />
                Join 2,503+ Subscribers
              </Link>
            </div>

            {/* Related Teardowns */}
            {related.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">More Failures to Learn From</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {related.map(relatedTeardown => (
                    <Link
                      key={relatedTeardown.id}
                      to={`/teardown/${relatedTeardown.id}`}
                      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{relatedTeardown.name}</h3>
                        {relatedTeardown.images && relatedTeardown.images.length > 0 && (
                          <ImageIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{relatedTeardown.short_description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{relatedTeardown.market}</span>
                        <span className="text-xs text-red-600 flex items-center">
                          Read more
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4 relative lg:sticky lg:top-16 max-w-[400px] sm:max-w-[250px] lg:max-w-[300px] w-full">
            <div className="sticky top-16 bg-gray-50 border rounded-2xl shadow-sm p-1 space-y-3">
              <TeardownSideBar
                title="How MicroSaaS Found a Profitable Niche"
                description="A real founder’s guide on building a $5K/mo business without code."
                image="https://example.com/microsaas-cover.jpg"
                sponsorName="NicheStarter"
                link="https://nichestarter.com/teardown"
              />
              <TeardownSideBar
                title="Startup Legal Checklist"
                description="Free PDF by top startup lawyers: avoid 7 costly legal traps."
                image="https://example.com/legal-guide.jpg"
                sponsorName="FoundersLegal"
                link="https://founderslegal.com/checklist"
              />
              <TeardownSideBar
                title="Automate Your Cold Outreach in 5 Minutes"
                description="Send personalized emails using AI and boost conversions 10x."
                image="https://example.com/outreach.jpg"
                sponsorName="MailHack"
                link="https://mailhack.io/demo"
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TeardownDetail;