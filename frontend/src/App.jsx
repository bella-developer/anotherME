import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastProvider } from './components/ToastContainer';
import { StatsProvider } from './contexts/StatsContext';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import LevelUpNotification from './components/LevelUpNotification';
import { useLevelUpNotifications } from './hooks/useLevelUpNotifications';
import IntrovertsBg from './components/IntrovertsBg';
import Home from './pages/Home';
import { getSession, selectAuthLoading } from './features/authSlice';

// Lazy load other route components for code splitting
const Landing = lazy(() => import('./pages/Landing'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Circles = lazy(() => import('./pages/Circles'));
const CircleDetail = lazy(() => import('./pages/CircleDetail'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const DarkRoom = lazy(() => import('./pages/DarkRoom'));
const ClimbRoom = lazy(() => import('./pages/ClimbRoom'));
const PhiloRoom = lazy(() => import('./pages/PhiloRoom'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Rules = lazy(() => import('./pages/Rules'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Support = lazy(() => import('./pages/Support'));
const Manifesto = lazy(() => import('./pages/Manifesto'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Explore = lazy(() => import('./pages/Explore'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

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

function App() {
  const dispatch = useDispatch();
  const authLoading = useSelector(selectAuthLoading);
  const sessionChecked = useSelector((state) => state.auth.sessionChecked);
  const { currentNotification, closeNotification } = useLevelUpNotifications();

  // Restore session on app mount
  useEffect(() => {
    dispatch(getSession());
  }, []); // Empty dependency array - only run once on mount

  // Show loading spinner while checking authentication on initial load
  // Only show loading if we haven't checked session yet AND still loading
  if (!sessionChecked && authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <IntrovertsBg />
        <div className="relative z-10">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <IntrovertsBg />
      <ToastProvider>
        <StatsProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* Public routes - Landing and Auth */}
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Protected routes - Require authentication */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/circles"
              element={
                <ProtectedRoute>
                  <Circles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/circles/:id"
              element={
                <ProtectedRoute>
                  <CircleDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:postId"
              element={
                <ProtectedRoute>
                  <PostDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support"
              element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manifesto"
              element={
                <ProtectedRoute>
                  <Manifesto />
                </ProtectedRoute>
              }
            />
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
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/dark"
              element={
                <ProtectedRoute>
                  <DarkRoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/climb"
              element={
                <ProtectedRoute>
                  <ClimbRoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/philo"
              element={
                <ProtectedRoute>
                  <PhiloRoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rules"
              element={
                <ProtectedRoute>
                  <Rules />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <AboutUs />
                </ProtectedRoute>
              }
            />

            {/* Catch all - 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Level-Up Notifications */}
          {currentNotification && (
            <LevelUpNotification
              room={currentNotification.room}
              levelUp={currentNotification.levelUp}
              onClose={closeNotification}
            />
          )}
        </Suspense>
      </StatsProvider>
    </ToastProvider>
  </Router>
  );
}

export default App;
