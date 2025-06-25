import React, { useState } from 'react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { Plus, CheckCircle, AlertTriangle, Target, ExternalLink, ArrowRight, Lock, Upload, X, Image } from 'lucide-react';
import DataStore from '../utils/dataStore';

const SubmitStory = () => {
  const { isSignedIn, user } = useUser();
  const [formData, setFormData] = useState({
    startupName: '',
    founderName: user?.firstName + ' ' + user?.lastName || '',
    email: user?.emailAddresses?.[0]?.emailAddress || '',
    market: '',
    duration: '',
    revenue: '',
    failureReasons: [''],
    lessonsLearned: [''],
    detailedStory: '',
    sourceLinks: '',
    currentVenture: '',
    currentVentureUrl: '',
    agreeToTerms: false,
    images: [] as string[]
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isSignedIn && user) {
      setFormData(prev => ({
        ...prev,
        founderName: (user.firstName || '') + ' ' + (user.lastName || ''),
        email: user.emailAddresses?.[0]?.emailAddress || ''
      }));
    }
  }, [isSignedIn, user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: 'failureReasons' | 'lessonsLearned', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'failureReasons' | 'lessonsLearned') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'failureReasons' | 'lessonsLearned', index: number) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Clean up the data
      const cleanedData = {
        ...formData,
        failureReasons: formData.failureReasons.filter(r => r.trim() !== ''),
        lessonsLearned: formData.lessonsLearned.filter(l => l.trim() !== '')
      };

      // Submit to DataStore
      DataStore.getInstance().addSubmission(cleanedData);

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting story:', error);
      alert('There was an error submitting your story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: Target,
      title: 'Help Other Entrepreneurs',
      description: 'Your story could save someone from making the same expensive mistakes'
    },
    {
      icon: ExternalLink,
      title: 'Get Traffic to Your New Venture',
      description: 'We\'ll link to your current successful project, driving qualified traffic'
    },
    {
      icon: Plus,
      title: 'Build Your Personal Brand',
      description: 'Position yourself as an experienced founder who learns from failure'
    }
  ];

  const featuredStories = [
    {
      founder: 'David Chen',
      failedStartup: 'TaskFlow',
      currentVenture: 'ProductivityPro',
      traffic: '2,847 visitors',
      description: 'Shared how poor user onboarding killed his first startup'
    },
    {
      founder: 'Maria Rodriguez',
      failedStartup: 'SocialMetrics',
      currentVenture: 'GrowthHacker',
      traffic: '1,923 visitors',
      description: 'Detailed the pricing mistakes that led to customer churn'
    },
    {
      founder: 'James Wilson',
      failedStartup: 'CodeReview',
      currentVenture: 'DevTools',
      traffic: '3,456 visitors',
      description: 'Explained how feature bloat destroyed product-market fit'
    }
  ];

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Lock className="h-16 w-16 text-red-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sign In Required
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              To maintain quality and prevent spam, we require authentication to submit failure stories.
              This also helps us give you proper credit and link back to your current venture.
            </p>
            <SignInButton mode="modal">
              <button className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors">
                Sign In to Share Your Story
              </button>
            </SignInButton>
            <p className="text-sm text-gray-500 mt-4">
              Don't have an account? Signing up is free and takes 30 seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You for Sharing!
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Your failure story has been submitted for review. We'll get back to you within
              48 hours with next steps.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
              <ul className="text-green-700 text-sm space-y-1 text-left max-w-md mx-auto">
                <li>• We'll review your story for authenticity and value</li>
                <li>• Our team will help polish the narrative if needed</li>
                <li>• Once published, we'll promote it to our {DataStore.getInstance().getStats().subscriberCount.toLocaleString()}+ subscribers</li>
                <li>• You'll get traffic and backlinks to your current venture</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    startupName: '',
                    founderName: (user?.firstName || '') + ' ' + (user?.lastName || ''),
                    email: user?.emailAddresses?.[0]?.emailAddress || '',
                    market: '',
                    duration: '',
                    revenue: '',
                    failureReasons: [''],
                    lessonsLearned: [''],
                    detailedStory: '',
                    sourceLinks: '',
                    currentVenture: '',
                    currentVentureUrl: '',
                    agreeToTerms: false,
                    images: []
                  });
                }}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Submit Another Story
              </button>
              <a
                href="/failure-stories"
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Browse Other Stories
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Plus className="h-16 w-16 text-red-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Share Your Failure Story
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Turn your past startup failure into valuable lessons for the community.
            Help other entrepreneurs avoid the same mistakes while getting traffic to your new venture.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center bg-white rounded-lg p-6 shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <benefit.icon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Featured Success Stories */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Success Stories from Contributors</h2>
          <div className="space-y-6">
            {featuredStories.map((story, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded-r-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {story.founder} - {story.failedStartup} → {story.currentVenture}
                    </h3>
                    <p className="text-gray-600 mb-2">{story.description}</p>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {story.traffic} to new venture
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Your Story</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Failed Startup Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.startupName}
                  onChange={(e) => handleInputChange('startupName', e.target.value)}
                  placeholder="e.g., TaskFlow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                  value={formData.founderName}
                  onChange={(e) => handleInputChange('founderName', e.target.value)}
                  placeholder="e.g., Sarah Chen"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market/Industry *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.market}
                  onChange={(e) => handleInputChange('market', e.target.value)}
                  placeholder="e.g., Productivity Software"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 2 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenue/Funding Raised
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.revenue}
                  onChange={(e) => handleInputChange('revenue', e.target.value)}
                  placeholder="e.g., $50K raised, $5K MRR"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Screenshots & Images (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Upload screenshots, mockups, or other relevant images</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red-700 transition-colors inline-flex items-center"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Choose Images
                </label>
              </div>

              {/* Image Preview */}
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
                Why It Failed *
              </label>
              {formData.failureReasons.map((reason, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={reason}
                    onChange={(e) => handleArrayInputChange('failureReasons', index, e.target.value)}
                    placeholder="e.g., Poor user onboarding led to high churn"
                  />
                  {formData.failureReasons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('failureReasons', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('failureReasons')}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                + Add Another Reason
              </button>
            </div>

            {/* Lessons Learned */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lessons Learned *
              </label>
              {formData.lessonsLearned.map((lesson, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={lesson}
                    onChange={(e) => handleArrayInputChange('lessonsLearned', index, e.target.value)}
                    placeholder="e.g., Always validate with paying customers first"
                  />
                  {formData.lessonsLearned.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('lessonsLearned', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Target className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('lessonsLearned')}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                + Add Another Lesson
              </button>
            </div>

            {/* Detailed Story */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Story *
              </label>
              <textarea
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={formData.detailedStory}
                onChange={(e) => handleInputChange('detailedStory', e.target.value)}
                placeholder="Tell the full story of what happened. What was the idea? How did you execute? What went wrong? Be specific about numbers, timelines, and decisions."
              />
            </div>

            {/* Current Venture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Venture Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.currentVenture}
                  onChange={(e) => handleInputChange('currentVenture', e.target.value)}
                  placeholder="e.g., ProductivityPro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Venture URL
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={formData.currentVentureUrl}
                  onChange={(e) => handleInputChange('currentVentureUrl', e.target.value)}
                  placeholder="https://productivitypro.com"
                />
              </div>
            </div>

            {/* Source Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Links (Optional)
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={formData.sourceLinks}
                onChange={(e) => handleInputChange('sourceLinks', e.target.value)}
                placeholder="Any blog posts, tweets, or other public content about the failure"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToTerms"
                required
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                I agree to have my story published on Intentora: Failed Startup Postmortem and understand that
                it will include a link to my current venture. I confirm this story is truthful
                and I have the right to share it.
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isLoading ? 'Submitting...' : 'Submit Story'}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitStory;