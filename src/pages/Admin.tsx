import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Shield,
  Users,
  BarChart3,
  Mail,
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  MessageSquare,
  Image
} from 'lucide-react';
import DataStore, { Teardown, SubmittedStory } from '../utils/dataStore';

interface TeardownFormData {
  id: string;
  name: string;
  market: string;
  revenue: string;
  duration: string;
  failure_reasons: string[];
  lessons_learned: string[];
  tags: string[];
  source_url: string;
  short_description: string;
  detailed_summary: string;
  is_premium: boolean;
  images: string[];
}

const Admin = () => {
  const { user } = useUser();
  const dataStore = DataStore.getInstance();

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === 'admin' ||
    user?.emailAddresses?.[0]?.emailAddress === 'isaacbawan@gmail.com';

  const [teardowns, setTeardowns] = useState<Teardown[]>([]);
  const [submissions, setSubmissions] = useState<SubmittedStory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTeardown, setEditingTeardown] = useState<TeardownFormData | null>(null);
  const [activeTab, setActiveTab] = useState('teardowns');
  const [selectedStory, setSelectedStory] = useState<SubmittedStory | null>(null);
  const [stats, setStats] = useState(dataStore.getStats());

  // Load data on component mount and set up real-time updates
  useEffect(() => {
    const loadData = () => {
      setTeardowns(dataStore.getTeardowns());
      setSubmissions(dataStore.getSubmissions());
      setStats(dataStore.getStats());
    };

    loadData();

    // Listen for storage changes to update data in real-time
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, [dataStore]);

  const [formData, setFormData] = useState<TeardownFormData>({
    id: '',
    name: '',
    market: '',
    revenue: '',
    duration: '',
    failure_reasons: [''],
    lessons_learned: [''],
    tags: [''],
    source_url: '',
    short_description: '',
    detailed_summary: '',
    is_premium: false,
    images: []
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-xl text-gray-600">
            You don't have permission to access the admin panel.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Contact admin@intentorafailedsaas.com if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof TeardownFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: 'failure_reasons' | 'lessons_learned' | 'tags', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'failure_reasons' | 'lessons_learned' | 'tags') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'failure_reasons' | 'lessons_learned' | 'tags', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, result]
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      failure_reasons: formData.failure_reasons.filter(r => r.trim() !== ''),
      lessons_learned: formData.lessons_learned.filter(l => l.trim() !== ''),
      tags: formData.tags.filter(t => t.trim() !== '')
    };

    if (editingTeardown) {
      // Update existing teardown
      dataStore.updateTeardown(editingTeardown.id, cleanedData);
    } else {
      // Add new teardown
      dataStore.addTeardown(cleanedData);
    }

    // Refresh data
    setTeardowns(dataStore.getTeardowns());
    setStats(dataStore.getStats());
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      market: '',
      revenue: '',
      duration: '',
      failure_reasons: [''],
      lessons_learned: [''],
      tags: [''],
      source_url: '',
      short_description: '',
      detailed_summary: '',
      is_premium: false,
      images: []
    });
    setIsEditing(false);
    setEditingTeardown(null);
  };

  const handleEdit = (teardown: Teardown) => {
    setFormData({
      ...teardown,
      images: teardown.images || []
    });
    setEditingTeardown(teardown);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this teardown?')) {
      dataStore.deleteTeardown(id);
      setTeardowns(dataStore.getTeardowns());
      setStats(dataStore.getStats());
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(teardowns, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'teardowns-export.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleStoryAction = (storyId: string, action: 'approve' | 'reject') => {
    const reviewedBy = user?.emailAddresses?.[0]?.emailAddress || 'Admin';
    dataStore.updateSubmissionStatus(storyId, action, reviewedBy);

    if (action === 'approve') {
      // Convert to teardown
      dataStore.convertSubmissionToTeardown(storyId);
      setTeardowns(dataStore.getTeardowns());
    }

    // Refresh submissions and stats
    setSubmissions(dataStore.getSubmissions());
    setStats(dataStore.getStats());
  };

  const tabs = [
    { id: 'teardowns', name: 'Failure Stories', icon: BarChart3 },
    { id: 'submissions', name: 'Story Submissions', icon: MessageSquare },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'newsletter', name: 'Newsletter', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage failure stories, review submissions, and track analytics</p>
          <p className="text-sm text-gray-500">Welcome, {user?.firstName || 'Admin'}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-gray-900">{stats.totalTeardowns}</div>
            <div className="text-sm text-gray-600">Total Stories</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-gray-900">{stats.subscriberCount.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Newsletter Subscribers</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-gray-900">{stats.pendingSubmissions}</div>
            <div className="text-sm text-gray-600">Pending Submissions</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-gray-900">{stats.monthlyPageviews.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Monthly Pageviews</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
                {tab.id === 'submissions' && stats.pendingSubmissions > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                    {stats.pendingSubmissions}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Teardowns Tab */}
        {activeTab === 'teardowns' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Failure Stories</h2>
              <div className="flex space-x-4">
                <button
                  onClick={exportData}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Story
                </button>
              </div>
            </div>

            {/* Teardown Form Modal */}
            {isEditing && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        {editingTeardown ? 'Edit Story' : 'Add New Story'}
                      </h3>
                      <button
                        onClick={resetForm}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Startup Name
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Market/Industry
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            value={formData.market}
                            onChange={(e) => handleInputChange('market', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Revenue/Funding
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            value={formData.revenue}
                            onChange={(e) => handleInputChange('revenue', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            value={formData.duration}
                            onChange={(e) => handleInputChange('duration', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Short Description
                        </label>
                        <textarea
                          required
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          value={formData.short_description}
                          onChange={(e) => handleInputChange('short_description', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Detailed Summary
                        </label>
                        <textarea
                          required
                          rows={5}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          value={formData.detailed_summary}
                          onChange={(e) => handleInputChange('detailed_summary', e.target.value)}
                        />
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Images
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="admin-image-upload"
                          />
                          <label
                            htmlFor="admin-image-upload"
                            className="bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red-700 transition-colors inline-flex items-center"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Images
                          </label>
                        </div>

                        {formData.images.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {formData.images.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={image}
                                  alt={`Upload ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Failure Reasons */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Failure Reasons
                        </label>
                        {formData.failure_reasons.map((reason, index) => (
                          <div key={index} className="flex items-center space-x-2 mb-2">
                            <input
                              type="text"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              value={reason}
                              onChange={(e) => handleArrayInputChange('failure_reasons', index, e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('failure_reasons', index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayItem('failure_reasons')}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          + Add Reason
                        </button>
                      </div>

                      {/* Lessons Learned */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lessons Learned
                        </label>
                        {formData.lessons_learned.map((lesson, index) => (
                          <div key={index} className="flex items-center space-x-2 mb-2">
                            <input
                              type="text"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              value={lesson}
                              onChange={(e) => handleArrayInputChange('lessons_learned', index, e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('lessons_learned', index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayItem('lessons_learned')}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          + Add Lesson
                        </button>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags
                        </label>
                        {formData.tags.map((tag, index) => (
                          <div key={index} className="flex items-center space-x-2 mb-2">
                            <input
                              type="text"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              value={tag}
                              onChange={(e) => handleArrayInputChange('tags', index, e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('tags', index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayItem('tags')}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          + Add Tag
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Source URL
                        </label>
                        <input
                          type="url"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          value={formData.source_url}
                          onChange={(e) => handleInputChange('source_url', e.target.value)}
                        />
                      </div>

                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {editingTeardown ? 'Update' : 'Create'} Story
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Teardowns List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Market
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Images
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teardowns.map((teardown) => (
                    <tr key={teardown.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{teardown.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{teardown.market}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{teardown.revenue}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {teardown.images && teardown.images.length > 0 ? (
                            <div className="flex items-center">
                              <Image className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-sm text-gray-600">{teardown.images.length}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">None</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(teardown)}
                          className="text-red-600 hover:text-red-900 mr-4"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(teardown.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Story Submissions Tab */}
        {activeTab === 'submissions' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Story Submissions</h2>
            <div className="space-y-6">
              {submissions.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                  <p className="text-gray-600">Story submissions will appear here for review.</p>
                </div>
              ) : (
                submissions.map((story) => (
                  <div key={story.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {story.startupName} by {story.founderName}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {story.market} • {story.duration} • {story.revenue}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Submitted: {new Date(story.submittedAt).toLocaleDateString()}
                        </p>
                        {story.images && story.images.length > 0 && (
                          <div className="flex items-center mt-2">
                            <Image className="h-4 w-4 text-blue-500 mr-1" />
                            <span className="text-sm text-gray-600">{story.images.length} images</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${story.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          story.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {story.status === 'pending' && <Clock className="h-3 w-3 inline mr-1" />}
                          {story.status === 'approved' && <CheckCircle className="h-3 w-3 inline mr-1" />}
                          {story.status === 'rejected' && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                          {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                        </span>
                        <button
                          onClick={() => setSelectedStory(selectedStory?.id === story.id ? null : story)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {selectedStory?.id === story.id && (
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        {/* Images */}
                        {story.images && story.images.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Images</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {story.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Submission image ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Failure Reasons</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {story.failureReasons.map((reason, index) => (
                                <li key={index}>• {reason}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Lessons Learned</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {story.lessonsLearned.map((lesson, index) => (
                                <li key={index}>• {lesson}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Detailed Story</h4>
                          <p className="text-sm text-gray-600">{story.detailedStory}</p>
                        </div>

                        {story.currentVenture && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Current Venture</h4>
                            <a
                              href={story.currentVentureUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              {story.currentVenture} ↗
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {story.status === 'pending' && (
                      <div className="flex space-x-4 mt-4">
                        <button
                          onClick={() => handleStoryAction(story.id, 'approve')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve & Publish
                        </button>
                        <button
                          onClick={() => handleStoryAction(story.id, 'reject')}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 flex items-center"
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Overview</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Monthly Pageviews:</strong> {stats.monthlyPageviews.toLocaleString()}</p>
                  <p><strong>Unique Visitors:</strong> {Math.round(stats.monthlyPageviews * 0.65).toLocaleString()}</p>
                  <p><strong>Avg. Session Duration:</strong> 4:32</p>
                  <p><strong>Bounce Rate:</strong> 28%</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Newsletter Performance</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Subscribers:</strong> {stats.subscriberCount.toLocaleString()}</p>
                  <p><strong>Open Rate:</strong> 94.2%</p>
                  <p><strong>Click Rate:</strong> 31.7%</p>
                  <p><strong>Growth Rate:</strong> +18% this month</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Newsletter Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Weekly Newsletter</h3>
                <p className="text-gray-600 mb-4">
                  Create and send the weekly failure report to all subscribers.
                </p>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Compose Newsletter
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscriber Management</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><strong>Total Subscribers:</strong> {stats.subscriberCount.toLocaleString()}</p>
                  <p><strong>New This Week:</strong> {Math.round(stats.subscriberCount * 0.02)}</p>
                  <p><strong>Unsubscribes:</strong> {Math.round(stats.subscriberCount * 0.001)}</p>
                </div>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export Subscribers
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;