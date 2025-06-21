import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Mail, Twitter, Linkedin, Plus } from 'lucide-react';
import Logo from '../resources/Intentora.png';


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img src={Logo} alt="Itentora Logo" />
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Learn from the mistakes of others. Comprehensive teardowns of failed SaaS startups
              to help you avoid common pitfalls and build sustainable businesses.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/failure-stories" className="text-gray-400 hover:text-white transition-colors">
                  Browse Stories
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-400 hover:text-white transition-colors">
                  Failure Analytics
                </Link>
              </li>
              <li>
                <Link to="/submit-story" className="text-gray-400 hover:text-white transition-colors">
                  Share Your Story
                </Link>
              </li>
              <li>
                <Link to="/newsletter" className="text-gray-400 hover:text-white transition-colors">
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get weekly failure insights delivered to your inbox.
            </p>
            <Link
              to="/newsletter"
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors inline-flex items-center"
            >
              <Mail className="h-4 w-4 mr-2" />
              Join Newsletter
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Intentora: Failed SaaS Postmortem. All rights reserved. Learn from failure, build success.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;