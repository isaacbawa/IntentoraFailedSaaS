import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, TrendingDown, DollarSign, Clock, Tag, ArrowRight, Mail, Image } from 'lucide-react';
import DataStore from '../utils/dataStore';

const FailureStories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [teardowns, setTeardowns] = useState(DataStore.getInstance().getTeardowns());

  // Refresh data when component mounts or when data changes
  useEffect(() => {
    const refreshData = () => {
      setTeardowns(DataStore.getInstance().getTeardowns());
    };

    // Listen for storage changes to update data in real-time
    window.addEventListener('storage', refreshData);

    // Also refresh on focus (in case data was changed in another tab)
    window.addEventListener('focus', refreshData);

    return () => {
      window.removeEventListener('storage', refreshData);
      window.removeEventListener('focus', refreshData);
    };
  }, []);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    teardowns.forEach(teardown => {
      teardown.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [teardowns]);

  // Filter and sort teardowns
  const filteredTeardowns = useMemo(() => {
    let filtered = teardowns.filter(teardown => {
      const matchesSearch = teardown.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teardown.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teardown.short_description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTag = !selectedTag || teardown.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'market':
          return a.market.localeCompare(b.market);
        case 'duration':
          return a.duration.localeCompare(b.duration);
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedTag, sortBy, teardowns]);

  const TeardownCard = ({ teardown }: { teardown: typeof teardowns[0] }) => {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        {/* Image if available */}
        {teardown.images && teardown.images.length > 0 && (
          <div className="h-48 overflow-hidden">
            <img
              src={teardown.images[0]}
              alt={teardown.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Hide image if it fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{teardown.name}</h3>
                {teardown.images && teardown.images.length > 0 && (
                  <Image className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <p className="text-gray-600 mb-3">{teardown.short_description}</p>
            </div>
            <div className="flex flex-col items-end space-y-1 ml-4">
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                {teardown.market}
              </span>
              <span className="text-gray-500 text-xs">{teardown.duration}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                Why It Failed
              </h4>
              <ul className="space-y-1">
                {teardown.failure_reasons.slice(0, 2).map((reason, index) => (
                  <li key={index} className="text-sm text-gray-600">• {reason}</li>
                ))}
                {teardown.failure_reasons.length > 2 && (
                  <li className="text-sm text-gray-500">+{teardown.failure_reasons.length - 2} more</li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                Funding Lost
              </h4>
              <p className="text-sm text-gray-600">{teardown.revenue}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {teardown.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              to={`/teardown/${teardown.id}`}
              className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center"
            >
              Read Full Story
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Failure Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from {teardowns.length} real startup failures. Each story reveals the critical mistakes
            that cost entrepreneurs millions.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search startups..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Tag Filter */}
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">All Categories</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="market">Sort by Market</option>
                <option value="duration">Sort by Duration</option>
                <option value="newest">Sort by Newest</option>
              </select>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-2">
              <span className="text-sm text-gray-600">
                <strong>{filteredTeardowns.length}</strong> of <strong>{teardowns.length}</strong> stories
              </span>
            </div>
          </div>
        </div>

        {/* Teardown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {filteredTeardowns.map(teardown => (
            <TeardownCard key={teardown.id} teardown={teardown} />
          ))}
        </div>

        {/* No Results */}
        {filteredTeardowns.length === 0 && (
          <div className="text-center py-12">
            <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No failure stories found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Get Weekly Failure Insights
          </h2>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            Don't just browse the stories. Get a detailed startup failure analysis delivered
            to your inbox every week. Learn from others' mistakes before you make them.
          </p>
          <Link
            to="/newsletter"
            className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            <Mail className="mr-2 h-5 w-5" />
            Join 2,503+ Subscribers
            {/* Join {DataStore.getInstance().getStats().subscriberCount.toLocaleString()}+ Subscribers ## Todo */}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FailureStories;