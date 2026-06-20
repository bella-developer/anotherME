import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import NotificationBell from './NotificationBell';
import logo from '../assets/images/anotherme-logo.png';

/**
 * Navbar Component
 * Implements responsive navigation with accessibility features
 * Requirements: 22.1-22.7, 30.1-30.7
 */
function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Don't show navbar on landing/auth pages
  const location = window.location.pathname;
  const isAuthPage = location === '/landing' || location === '/register' || location === '/login';
  
  if (isAuthPage) {
    return null;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 h-16"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Tagline */}
          <Link 
            to="/home" 
            className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:ring-offset-2 focus:ring-offset-black rounded"
            aria-label="Dark Room home"
          >
            <img src={logo} alt="anotherME" className="h-8 w-auto" />
            <h1 className="text-lg md:text-xl font-bold text-white">anotherME</h1>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            <Link
              to="/home"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] rounded px-2 py-1"
              role="menuitem"
            >
              Home
            </Link>
            <Link
              to="/circles"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] rounded px-2 py-1"
              role="menuitem"
            >
              Circles
            </Link>
            <Link
              to="/support"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] rounded px-2 py-1"
              role="menuitem"
            >
              Support
            </Link>
          </div>

          {/* User Info / Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/about"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] rounded px-2 py-1"
              role="menuitem"
            >
              About Us
            </Link>
            {isAuthenticated && <NotificationBell />}
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="w-9 h-9 rounded-full bg-[#ff6b35] flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label={`Profile: ${user?.username || 'User'}`}
              >
                <span className="text-white text-sm font-bold">
                  {(user?.username || 'U').charAt(0).toUpperCase()}
                </span>
              </Link>
            ) : (
              <Link
                to="/register"
                className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
              >
                <span className="text-white text-sm">?</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Menu - Increased touch target */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-primary-bg rounded p-2 min-h-touch min-w-touch flex items-center justify-center"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu - Full screen overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="md:hidden fixed inset-0 top-16 bg-black bg-opacity-80 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* Menu content */}
            <div 
              id="mobile-menu"
              className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-primary-secondary border-b border-border shadow-lg z-50 overflow-y-auto"
              role="menu"
            >
              <div className="flex flex-col space-y-1 p-4">
                <Link
                  to="/home"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-text-secondary hover:text-text-primary hover:bg-primary-elevated transition-colors duration-200 py-3 px-4 rounded-lg min-h-touch flex items-center focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  role="menuitem"
                >
                  Home
                </Link>
                <Link
                  to="/circles"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-text-secondary hover:text-text-primary hover:bg-primary-elevated transition-colors duration-200 py-3 px-4 rounded-lg min-h-touch flex items-center focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  role="menuitem"
                >
                  Circles
                </Link>
                <Link
                  to="/support"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-text-secondary hover:text-text-primary hover:bg-primary-elevated transition-colors duration-200 py-3 px-4 rounded-lg min-h-touch flex items-center focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  role="menuitem"
                >
                  Support
                </Link>
                <Link
                  to="/create"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-text-secondary hover:text-text-primary hover:bg-primary-elevated transition-colors duration-200 py-3 px-4 rounded-lg min-h-touch flex items-center focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  role="menuitem"
                >
                  Create
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-text-secondary hover:text-text-primary hover:bg-primary-elevated transition-colors duration-200 py-3 px-4 rounded-lg min-h-touch flex items-center focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  role="menuitem"
                >
                  About Us
                </Link>
                {isAuthenticated ? (
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 py-3 px-4 border-t border-border hover:bg-primary-elevated transition-colors rounded-lg min-h-touch mt-2 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    role="menuitem"
                    aria-label={`Profile: ${user?.username || 'User'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <svg
                        className="w-5 h-5 text-accent-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <span className="text-text-primary text-base font-medium">
                      {user?.username || 'User'}
                    </span>
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-accent-primary hover:text-accent-primary/80 hover:bg-primary-elevated transition-colors duration-200 py-3 px-4 border-t border-border rounded-lg min-h-touch mt-2 flex items-center focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    role="menuitem"
                  >
                    Join
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
