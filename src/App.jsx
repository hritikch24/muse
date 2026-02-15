import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useStore from './store/useStore';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DiscoveryPage from './pages/DiscoveryPage';
import MatchesPage from './pages/MatchesPage';
import ChatPage from './pages/ChatPage';
import MomentsPage from './pages/MomentsPage';
import ProfilePage from './pages/ProfilePage';
import MainLayout from './components/common/MainLayout';

function App() {
  const { isAuthenticated, currentUser } = useStore();

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  if (currentUser && !currentUser.onboardingCompleted) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<OnboardingPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DiscoveryPage />} />
          <Route path="matches" element={<MatchesPage />} />
          <Route path="chat/:chatId" element={<ChatPage />} />
          <Route path="moments" element={<MomentsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
