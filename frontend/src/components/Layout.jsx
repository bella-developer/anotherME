import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import IntrovertsBg from './IntrovertsBg';

/**
 * Layout Component
 * Implements responsive three-column layout with accessibility features
 */
function Layout({ leftSidebar, rightSidebar, children }) {
  return (
    <div className="min-h-screen relative bg-transparent">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-primary focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <Navbar />

      {/* Main content area — sits above the fixed bg (z-index > 0) */}
      <div className="relative z-10 pt-7">
        <div className="container max-w-5xl mx-auto px-3 sm:px-5 lg:px-6 py-2 md:py-3">
          <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-3 md:gap-4 justify-center">
            {leftSidebar && (
              <aside className="hidden md:block md:col-span-4 lg:col-span-3" aria-label="Category filters">
                <div className="sticky top-16">{leftSidebar}</div>
              </aside>
            )}

            <main
              id="main-content"
              className={`col-span-1 ${
                leftSidebar && rightSidebar
                  ? 'md:col-span-8 lg:col-span-6'
                  : leftSidebar || rightSidebar
                  ? 'md:col-span-8 lg:col-span-9'
                  : 'md:col-span-12 lg:col-span-12 max-w-3xl mx-auto w-full'
              }`}
              role="main"
              aria-label="Main content"
            >
              {children || <Outlet />}
            </main>

            {rightSidebar && (
              <aside className="hidden lg:block lg:col-span-3" aria-label="Trending circles">
                <div className="sticky top-16">{rightSidebar}</div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
