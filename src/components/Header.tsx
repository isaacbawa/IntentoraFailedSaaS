import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { AlertTriangle, Menu, X, BarChart3, Plus } from 'lucide-react';
import Logo from '../resources/Intentora.png';


const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isSignedIn, user } = useUser();

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === 'admin' ||
    user?.emailAddresses?.[0]?.emailAddress === 'isaacbawan@gmail.com';

  const navigation = [
    { name: 'Failure Stories', href: '/failure-stories' },
    { name: 'Newsletter', href: '/newsletter' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Share Your Story', href: '/submit-story', icon: Plus },
  ];

  // Add admin navigation for admins
  if (isAdmin) {
    navigation.push({ name: 'Admin', href: '/admin' });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Intentora Logo" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center ${isActive(item.href)
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-700 hover:text-red-600'
                  }`}
              >
                {item.icon && <item.icon className="h-4 w-4 mr-1" />}
                {item.name === 'Analytics' && <BarChart3 className="h-4 w-4 mr-1" />}
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Welcome, {user.firstName || user.emailAddresses[0].emailAddress.split('@')[0]}
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <SignInButton mode="modal">
                  <button className="text-gray-700 hover:text-red-600 text-sm font-medium">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                    Join Newsletter
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium flex items-center ${isActive(item.href)
                      ? 'text-red-600'
                      : 'text-gray-700 hover:text-red-600'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <item.icon className="h-4 w-4 mr-1" />}
                  {item.name === 'Analytics' && <BarChart3 className="h-4 w-4 mr-1" />}
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100">
                {isSignedIn ? (
                  <div className="flex items-center px-3 py-2">
                    <UserButton afterSignOutUrl="/" />
                    <span className="ml-3 text-sm text-gray-600">
                      {user.firstName || user.emailAddresses[0].emailAddress.split('@')[0]}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <SignInButton mode="modal">
                      <button className="text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors text-center">
                        Join Newsletter
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;