import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import useStore from './store/useStore';
import MainLayout from './components/common/MainLayout';
import ErrorBoundary from './components/common/ErrorBoundary';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const DiscoveryPage = lazy(() => import('./pages/DiscoveryPage'));
const MatchesPage = lazy(() => import('./pages/MatchesPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const MomentsPage = lazy(() => import('./pages/MomentsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f0f1a', color: '#fff' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#FF6B9D', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
      <p>Loading...</p>
    </div>
  </div>
);

function ProtectedRoute({ children }) {
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const currentUser = useStore(state => state.currentUser);
  const checkSession = useStore(state => state.checkSession);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const handleBackButton = (e) => {
      if (window.location.pathname === '/') {
        e.preventDefault();
        navigate(-1);
      }
    };
    
    window.history.pushState(null, '', window.location.pathname);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!checkSession()) {
    return <Navigate to="/auth?session=expired" replace />;
  }
  
  if (currentUser && currentUser.onboardingCompleted === false) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return children;
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DiscoveryPage />} />
              <Route path="matches" element={<MatchesPage />} />
              <Route path="chat/:chatId" element={<ChatPage />} />
              <Route path="moments" element={<MomentsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
