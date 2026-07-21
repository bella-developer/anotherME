import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import NotificationBell from './NotificationBell';
import EsoLogo from './EsoLogo';

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
      className="fixed top-0 left-0 right-0 z-50 h-16"
      style={{ 
        background: 'rgba(0, 0, 0, 0.85)', 
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link 
            to="/home" 
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black rounded p-1"
            aria-label="ESO home"
          >
            <EsoLogo className="h-11 w-auto" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            <Link
              to="/home"
              className="text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-2 py-1 tracking-wider uppercase text-white/70 hover:text-white"
              role="menuitem"
            >
              Home
            </Link>
            <Link
              to="/circles"
              className="text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-2 py-1 tracking-wider uppercase text-white/70 hover:text-white"
              role="menuitem"
            >
              Circles
            </Link>
            <Link
              to="/support"
              className="text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-2 py-1 tracking-wider uppercase text-white/70 hover:text-white"
              role="menuitem"
            >
              Support
            </Link>
          </div>

          {/* User Info / Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/about"
              className="text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-2 py-1 tracking-wider uppercase text-white/70 hover:text-white"
              role="menuitem"
            >
              About Us
            </Link>
            {isAuthenticated && <NotificationBell />}
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="relative w-9 h-9 rounded-full bg-black flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label={`Profile: ${user?.username || 'User'}`}
              >
                {/* Concentric circles */}
                <div className="absolute inset-0 rounded-full border border-gray-700/40"></div>
                <div className="absolute inset-[-4px] rounded-full border border-gray-700/25"></div>
                
                <span className="text-[#D97757] text-sm font-bold relative z-10">
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
            className="md:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 rounded p-2 min-h-touch min-w-touch flex items-center justify-center text-white focus:ring-white/50 focus:ring-offset-black"
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
              className="md:hidden fixed inset-0 top-16 z-40"
              style={{ background: 'rgba(0, 0, 0, 0.8)' }}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* Menu content */}
            <div 
              id="mobile-menu"
              className="md:hidden fixed top-16 left-0 right-0 z-50 shadow-2xl"
              style={{
                background: 'rgba(10, 10, 10, 0.98)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                maxHeight: 'calc(100vh - 4rem)',
                overflowY: 'auto'
              }}
              role="menu"
            >
              <div className="flex flex-col space-y-1 p-4">
                <Link
                  to="/home"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 px-4 rounded-lg transition-colors duration-200 text-base font-medium text-white/80 hover:text-white hover:bg-white/10"
                  role="menuitem"
                >
                  Home
                </Link>
                <Link
                  to="/circles"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 px-4 rounded-lg transition-colors duration-200 text-base font-medium text-white/80 hover:text-white hover:bg-white/10"
                  role="menuitem"
                >
                  Circles
                </Link>
                <Link
                  to="/support"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 px-4 rounded-lg transition-colors duration-200 text-base font-medium text-white/80 hover:text-white hover:bg-white/10"
                  role="menuitem"
                >
                  Support
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 px-4 rounded-lg transition-colors duration-200 text-base font-medium text-white/80 hover:text-white hover:bg-white/10"
                  role="menuitem"
                >
                  About Us
                </Link>
                
                <div className="border-t my-2 border-white/10"></div>
                
                {isAuthenticated ? (
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors duration-200 text-white hover:bg-white/10"
                    role="menuitem"
                    aria-label={`Profile: ${user?.username || 'User'}`}
                  >
                    <div 
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-black border border-gray-700/40"
                    >
                      <span className="text-[#D97757] text-sm font-bold">
                        {(user?.username || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-base font-medium">
                      {user?.username || 'User'}
                    </span>
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 px-4 rounded-lg transition-colors duration-200 text-base font-medium text-[#D97757] hover:text-[#D97757]/80 hover:bg-white/10"
                    role="menuitem"
                  >
                    Join ESO
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
