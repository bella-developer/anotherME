import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ToastContainer';
import { StatsProvider } from './contexts/StatsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import LevelUpNotification from './components/LevelUpNotification';
import { useLevelUpNotifications } from './hooks/useLevelUpNotifications';
import IntrovertsBg from './components/IntrovertsBg';
import PaperTextureBg from './components/PaperTextureBg';
import ErrorBoundary from './components/ErrorBoundary';
import { useTheme } from './contexts/ThemeContext';

// Direct imports for public pages to avoid loading issues
import Home from './pages/Home';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import OAuthCallback from './pages/OAuthCallback';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Explore from './pages/Explore';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OAuthRedirect from './pages/OAuthRedirect';

// Lazy load protected route components for code splitting
const Circles = lazy(() => import('./pages/Circles'));
const CircleDetail = lazy(() => import('./pages/CircleDetail'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const DarkRoom = lazy(() => import('./pages/DarkRoom'));
const FantasyRoom = lazy(() => import('./pages/FantasyRoom'));
const PhiloRoom = lazy(() => import('./pages/PhiloRoom'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Rules = lazy(() => import('./pages/Rules'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Support = lazy(() => import('./pages/Support'));
const Manifesto = lazy(() => import('./pages/Manifesto'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Placeholder Create component
function Create() {
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold text-white mb-4">
        Create Post
      </h1>
      <p className="text-gray-400">Share your thoughts</p>
    </div>
  );
}

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="large" />
    </div>
  );
}

// Background component that switches based on theme
function ThemedBackground() {
  const { theme } = useTheme();
  const isLightMode = theme === 'light';
  
  return isLightMode ? <PaperTextureBg /> : <IntrovertsBg />;
}

function App() {
  const { currentNotification, closeNotification } = useLevelUpNotifications();

  // Don't check session on app mount - let protected routes handle it
  // This prevents unnecessary 401 errors on public pages
  // UI fixes deployed successfully

  return (
    <ThemeProvider>
      <Router>
        <ThemedBackground />
        <ToastProvider>
          <StatsProvider>
            <ErrorBoundary>
              <Routes>
              {/* Public routes - Direct imports, no Suspense needed */}
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="/oauth/redirect" element={<OAuthRedirect />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Protected routes - Lazy loaded, wrapped in Suspense */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <Home />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/circles"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <Circles />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/circles/:id"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <CircleDetail />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:postId"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <PostDetail />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/support"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <Support />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/manifesto"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <Manifesto />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route path="/terms" element={<Terms />} />
            <Route
              path="/archive"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Navigate to="/support" replace />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Create />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <Profile />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/dark"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <DarkRoom />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/fantasy"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <FantasyRoom />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/philo"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <PhiloRoom />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <Leaderboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rules"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <Rules />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <AboutUs />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Catch all - 404 Page */}
            <Route 
              path="*" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <NotFound />
                </Suspense>
              } 
            />
            </Routes>
          </ErrorBoundary>

          {/* Level-Up Notifications */}
          {currentNotification && (
            <LevelUpNotification
              room={currentNotification.room}
              levelUp={currentNotification.levelUp}
              onClose={closeNotification}
            />
          )}
        </StatsProvider>
      </ToastProvider>
    </Router>
    </ThemeProvider>
  );
}

export default App;
