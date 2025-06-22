import React, { useEffect, useState } from 'react';
import { Plus } from "lucide-react";
import { Link } from 'react-router-dom';
import { SignUpButton } from '@clerk/clerk-react';
import { TrendingDown, AlertTriangle, BookOpen, Target, Users, DollarSign, Mail, ArrowRight } from 'lucide-react';
import DataStore from '../utils/dataStore';

const Home = () => {
  const [stats, setStats] = useState(DataStore.getInstance().getStats());
  const [teardowns, setTeardowns] = useState(DataStore.getInstance().getTeardowns());

  useEffect(() => {
    const refreshData = () => {
      setStats(DataStore.getInstance().getStats());
      setTeardowns(DataStore.getInstance().getTeardowns());
    };

    window.addEventListener('storage', refreshData);
    window.addEventListener('focus', refreshData);

    return () => {
      window.removeEventListener('storage', refreshData);
      window.removeEventListener('focus', refreshData);
    };
  }, []);

  const featuredTeardown = teardowns.find(t => t.id === "1") || teardowns[0];

  const displayStats = [
    { icon: TrendingDown, label: 'Failed Startups', value: `${stats.totalTeardowns}+` },
    { icon: DollarSign, label: 'Money Lost', value: '$1.2B+' },
    { icon: BookOpen, label: 'Lessons Learned', value: `${stats.totalTeardowns * 5}+` },
    { icon: Users, label: 'Entrepreneurs Helped', value: stats.totalUsers.toLocaleString() },
  ];

  const subscriberAvatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face&auto=format'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Don't just study <span className="text-red-600">success</span>.
              <br />
              Learn from <span className="text-red-600">failure</span>.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A curated collection of real SaaS startup failures with detailed stories.
              Avoid the mistakes that killed over $1.2 billion in startups.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/failure-stories"
                className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                Explore Failure Stories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <SignUpButton mode="modal">
                <button className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Get Weekly Insights
                </button>
              </SignUpButton>
            </div>

            {/* Newsletter Social Proof */}
            <div className="mt-8 flex flex-col items-center">
              <div className="flex -space-x-2 mb-3">
                {subscriberAvatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`Subscriber ${index + 1}`}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Join <span className="font-semibold text-red-600">{stats.subscriberCount.toLocaleString()}</span> entrepreneurs learning from failure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {displayStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Teardown */}
      {featuredTeardown && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Failure Story</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Learn from one of the most expensive failures in startup history
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-4xl mx-auto">
              {featuredTeardown.images && featuredTeardown.images.length > 0 && (
                <div className="h-64 overflow-hidden">
                  <img
                    src={featuredTeardown.images[0]}
                    alt={featuredTeardown.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{featuredTeardown.name}</h3>
                    <p className="text-gray-600">{featuredTeardown.short_description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                      {featuredTeardown.market}
                    </span>
                    <span className="text-gray-500 text-sm">{featuredTeardown.duration}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Why It Failed</h4>
                    <ul className="space-y-2">
                      {featuredTeardown.failure_reasons.slice(0, 3).map((reason, index) => (
                        <li key={index} className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Lessons</h4>
                    <ul className="space-y-2">
                      {featuredTeardown.lessons_learned.slice(0, 3).map((lesson, index) => (
                        <li key={index} className="flex items-start">
                          <Target className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    to={`/teardown/${featuredTeardown.id}`}
                    className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
                  >
                    Read Full Story
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA Section */}
      <section className="py-16 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't Make the Same $50K Mistakes
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Get a detailed startup failure analysis delivered every week. Learn from others'
            million-dollar mistakes before you make them yourself.
          </p>

          {/* Newsletter Social Proof */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex -space-x-2 mb-3">
              {subscriberAvatars.slice(0, 6).map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Subscriber ${index + 1}`}
                  className="w-12 h-12 rounded-full border-3 border-red-500 shadow-lg"
                />
              ))}
            </div>
            <p className="text-red-100 text-sm mb-6">
              <span className="font-semibold">{stats.subscriberCount.toLocaleString()}</span> founders already learning from failure
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <button className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
                <Mail className="mr-2 h-5 w-5" />
                Join the Newsletter
              </button>
            </SignUpButton>
            <Link
              to="/failure-stories"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-red-600 transition-colors flex items-center justify-center"
            >
              Browse All Failures
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Share Your Story CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Failed Before? Help Others Learn
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Share your failure story and get traffic to your new successful venture.
            Turn your past mistakes into valuable lessons for the community.
          </p>
          <Link
            to="/submit-story"
            className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" />
            Share Your Story
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;