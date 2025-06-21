import React, { useState, useEffect } from 'react';
import { SignUpButton, useUser } from '@clerk/clerk-react';
import { Mail, CheckCircle, TrendingDown, Clock, Users, Star, ArrowRight } from 'lucide-react';
import DataStore from '../utils/dataStore';

const Newsletter = () => {
  const { isSignedIn, user } = useUser();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [stats, setStats] = useState(DataStore.getInstance().getStats());

  useEffect(() => {
    const refreshStats = () => {
      setStats(DataStore.getInstance().getStats());
    };

    window.addEventListener('storage', refreshStats);
    window.addEventListener('focus', refreshStats);

    return () => {
      window.removeEventListener('storage', refreshStats);
      window.removeEventListener('focus', refreshStats);
    };
  }, []);

  const handleSubscribe = () => {
    if (isSignedIn && user) {
      DataStore.getInstance().addSubscriber(
        user.emailAddresses[0].emailAddress,
        user.firstName || user.emailAddresses[0].emailAddress.split('@')[0]
      );
      setStats(DataStore.getInstance().getStats());
      setIsSubmitted(true);
    }
  };

  const benefits = [
    {
      icon: TrendingDown,
      title: 'Weekly Failure Deep-Dive',
      description: 'Get the brutal truth behind one failed startup every Tuesday'
    },
    {
      icon: Clock,
      title: 'Quick 3-minute reads',
      description: 'Actionable insights you can consume over your morning coffee'
    },
    {
      icon: Users,
      title: 'Exclusive Community',
      description: `Join ${stats.subscriberCount.toLocaleString()}+ entrepreneurs learning from million-dollar mistakes`
    }
  ];

  const recentIssues = [
    {
      title: 'How Homejoy Burned Through $38M in 4 Years',
      description: 'The legal battles and unit economics that killed the home cleaning giant',
      date: 'This Week',
      opens: '94% open rate'
    },
    {
      title: 'Quirky\'s $185M Lesson: Not Every Idea Deserves to Be a Product',
      description: 'Why crowdsourced invention platforms fail spectacularly',
      date: 'Last Week',
      opens: '91% open rate'
    },
    {
      title: 'The Rdio Postmortem: Losing to Spotify Despite Better Features',
      description: 'First-mover advantage means nothing without execution',
      date: '2 Weeks Ago',
      opens: '89% open rate'
    }
  ];

  const subscriberAvatars = [
    'https://images.unsplash.com/photo-1494790108755-2616b612b766?w=40&h=40&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=40&h=40&fit=crop&crop=face&auto=format',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face&auto=format'
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'SaaS Founder',
      content: 'This newsletter literally saved me from making a $75K pricing mistake. The Homejoy teardown was a wake-up call.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b766?w=64&h=64&fit=crop&crop=face&auto=format'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Product Manager',
      content: 'I forward these to my entire team every week. Best startup education I\'ve ever received.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format'
    },
    {
      name: 'Emily Watson',
      role: 'Startup Advisor',
      content: 'I recommend this to every founder I mentor. Learning from failure is more valuable than studying success.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face&auto=format'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Mail className="h-16 w-16 text-red-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            The Failure Report
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Every Tuesday, get the brutal truth behind one failed startup. Learn from 
            million-dollar mistakes without making them yourself.
          </p>
          
          {/* Social Proof with Avatars */}
          <div className="flex flex-col items-center mb-8">
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
            <p className="text-gray-600 flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              Join <span className="font-semibold text-red-600 mx-1">{stats.subscriberCount.toLocaleString()}</span> entrepreneurs • 
              <span className="font-semibold ml-1">94% open rate</span>
            </p>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          {isSignedIn && isSubmitted ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to the Community!</h2>
              <p className="text-gray-600 mb-6">
                You're now subscribed to our weekly failure reports. Your first issue arrives this Tuesday.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">
                  <strong>Pro tip:</strong> Add us to your contacts to ensure you never miss a teardown. 
                  These insights could save you thousands.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Don't Learn the Hard Way
                </h2>
                <p className="text-gray-600">
                  Get weekly failure insights that could save you $50K+ in mistakes
                </p>
              </div>
              
              <div className="max-w-md mx-auto text-center">
                {isSignedIn ? (
                  <div>
                    <p className="text-gray-600 mb-4">
                      Welcome back, {user?.firstName || user?.emailAddresses[0].emailAddress.split('@')[0]}!
                    </p>
                    <button
                      onClick={handleSubscribe}
                      className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      Subscribe to Weekly Reports
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <SignUpButton mode="modal">
                    <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center">
                      Get Weekly Failures
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </SignUpButton>
                )}
                <p className="text-xs text-gray-500 text-center mt-2">
                  Free forever. Unsubscribe anytime. No spam, just brutal startup truths.
                </p>
              </div>
            </div>
          )}
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

        {/* Recent Issues */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Issues</h2>
          <div className="space-y-6">
            {recentIssues.map((issue, index) => (
              <div key={index} className="border-l-4 border-red-600 pl-4 hover:bg-gray-50 p-4 rounded-r-lg transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{issue.title}</h3>
                    <p className="text-gray-600 mb-2">{issue.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{issue.date}</span>
                      <span className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        {issue.opens}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What Subscribers Say
            </h2>
            <p className="text-gray-600">Real feedback from entrepreneurs who avoided costly mistakes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                <div className="flex text-yellow-400 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Avoid Million-Dollar Mistakes?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join {stats.subscriberCount.toLocaleString()}+ entrepreneurs who are building smarter by learning from others' failures.
          </p>
          
          {/* Social Proof */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex -space-x-2 mb-3">
              {subscriberAvatars.slice(0, 8).map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Subscriber ${index + 1}`}
                  className="w-12 h-12 rounded-full border-3 border-red-500 shadow-lg"
                />
              ))}
            </div>
            <p className="text-red-100 text-sm">
              <span className="font-semibold">94% open rate</span> • 
              <span className="font-semibold ml-1">Zero spam</span> • 
              <span className="font-semibold ml-1">Unsubscribe anytime</span>
            </p>
          </div>

          {!isSignedIn && (
            <SignUpButton mode="modal">
              <button className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center mx-auto">
                Join Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </SignUpButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;