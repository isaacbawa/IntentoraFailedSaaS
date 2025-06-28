import React from 'react';
import { Link } from 'react-router-dom';
import { SignUpButton, useUser } from '@clerk/clerk-react';
import { Check, X, Star, Lock, Zap } from 'lucide-react';

interface PricingProps {
  isClerkEnabled: boolean;
}

const Pricing = ({ isClerkEnabled }: PricingProps) => {
  const { isSignedIn } = isClerkEnabled ? useUser() : { isSignedIn: false };

  const features = [
    {
      name: 'Access to teardown previews',
      free: true,
      premium: true
    },
    {
      name: 'Full failure analysis',
      free: false,
      premium: true
    },
    {
      name: 'Detailed lessons learned',
      free: false,
      premium: true
    },
    {
      name: 'Search and filter all failures',
      free: false,
      premium: true
    },
    {
      name: 'Weekly newsletter',
      free: true,
      premium: true
    },
    {
      name: 'Original source links',
      free: false,
      premium: true
    },
    {
      name: 'Download failure reports',
      free: false,
      premium: true
    },
    {
      name: 'Early access to new teardowns',
      free: false,
      premium: true
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Startup Founder',
      content: 'These teardowns saved me from making a $50K pricing mistake. Worth every penny.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b766?w=64&h=64&fit=crop&crop=face'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Product Manager',
      content: 'I reference these failures weekly. Essential reading for anyone building products.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face'
    },
    {
      name: 'Emily Watson',
      role: 'Startup Advisor',
      content: 'I recommend this to every founder I mentor. Learn from failure, not just success.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Avoid $50K Mistakes for $25/Month
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get access to detailed failure analysis, exclusive insights, and lessons learned from
            over $10 billion in failed startups.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Free Access</h2>
              <div className="text-4xl font-bold text-gray-900 mb-4">$0</div>
              <p className="text-gray-600">Perfect for getting started</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  {feature.free ? (
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  )}
                  <span className={feature.free ? 'text-gray-900' : 'text-gray-500'}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              to="/failure-stories"
              className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center block"
            >
              Start Reading
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-red-600 p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                <Star className="h-4 w-4 mr-1" />
                Most Popular
              </span>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium Access</h2>
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-gray-900">$25</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <p className="text-gray-600 mb-2">Full access to all failures</p>
              <p className="text-sm text-green-600">Save 40% with annual: $150/year</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-900">{feature.name}</span>
                </li>
              ))}
            </ul>

            {isClerkEnabled ? (
              isSignedIn ? (
                <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                  Upgrade to Premium
                </button>
              ) : (
                <SignUpButton mode="modal">
                  <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                    Get Premium Access
                  </button>
                </SignUpButton>
              )
            ) : (
              <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Get Premium Access
              </button>
            )}
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Premium Members Love It
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Insights</h3>
              <p className="text-gray-600">
                Get access to detailed failure analysis that reveals the real reasons why startups fail
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <Zap className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Actionable Lessons</h3>
              <p className="text-gray-600">
                Learn specific tactics and avoid the exact mistakes that cost others millions
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <Star className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Support</h3>
              <p className="text-gray-600">
                Weekly insights, early access to new teardowns, and downloadable reports
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What Our Members Say
            </h2>
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
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. No questions asked.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How many teardowns are there?</h3>
              <p className="text-gray-600">We currently have 22+ detailed teardowns with new ones added weekly.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Are these real failures?</h3>
              <p className="text-gray-600">Yes, every teardown is based on real startups with verified failure data and sources.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee if you're not satisfied.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Avoid Million-Dollar Mistakes?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join 1,000+ entrepreneurs who are building smarter by learning from others' failures.
          </p>
          {isClerkEnabled ? (
            isSignedIn ? (
              <button className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                Upgrade to Premium Now
              </button>
            ) : (
              <SignUpButton mode="modal">
                <button className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                  Get Premium Access
                </button>
              </SignUpButton>
            )
          ) : (
            <button className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Premium Access
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pricing;