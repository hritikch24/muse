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

  const getPage = () => {
    if (!isAuthenticated) {
      return <AuthPage />;
    }
    if (currentUser && !currentUser.onboardingCompleted) {
      return <OnboardingPage />;
    }
    return (
      <MainLayout>
        <Routes>
          <Route index element={<DiscoveryPage />} />
          <Route path="matches" element={<MatchesPage />} />
          <Route path="chat/:chatId" element={<ChatPage />} />
          <Route path="moments" element={<MomentsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Routes>
      </MainLayout>
    );
  };

  return (
    <BrowserRouter>
      {getPage()}
    </BrowserRouter>
  );
}

export default App;
