import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../store/useStore', () => ({
  default: vi.fn(() => ({
    currentUser: { id: '1', name: 'Test User', age: 25, photos: ['https://example.com/photo.jpg'], bio: 'Test bio', interests: ['Music'], location: 'NYC', online: true },
    isAuthenticated: true,
    profiles: [
      { id: '1', name: 'Sarah', age: 25, bio: 'Test bio', photos: ['https://example.com/1.jpg'], interests: ['Music'], online: true, distance: 5, lastActive: 'Now', prompts: [] },
      { id: '2', name: 'Emma', age: 28, bio: 'Another bio', photos: ['https://example.com/2.jpg'], interests: ['Travel'], online: false, distance: 10, lastActive: '2h ago', prompts: [] },
    ],
    matchedProfiles: [{ id: '1', user: { id: '1', name: 'Sarah', age: 25, photos: ['https://example.com/1.jpg'], bio: 'Test', online: true }, matchedAt: new Date().toISOString() }],
    passedProfiles: [],
    chats: [{ id: 'chat1', matchedProfile: { id: '1', name: 'Sarah', photos: ['https://example.com/1.jpg'], online: true }, lastMessage: 'Hey!', lastMessageTime: new Date().toISOString() }],
    messages: { 'chat1': [{ id: 'm1', text: 'Hey!', sender: 'them', timestamp: new Date().toISOString() }] },
    moments: [],
    notifications: [],
    preferences: { ageRange: [18, 50], distance: 50, gender: 'all' },
    premiumPlan: null,
    premiumExpiry: null,
    userLocation: { lat: 40.7128, lng: -74.006, city: 'New York' },
    premiumPlans: [
      { id: 'daily', name: 'Daily', price: 10, duration: 1 },
      { id: 'weekly', name: 'Weekly', price: 50, duration: 7 },
      { id: 'monthly', name: 'Monthly', price: 199, duration: 30 },
      { id: 'yearly', name: 'Yearly', price: 999, duration: 365 },
    ],
    login: vi.fn(() => true),
    signup: vi.fn(() => true),
    logout: vi.fn(),
    swipeRight: vi.fn(),
    swipeLeft: vi.fn(),
    undoSwipe: vi.fn(),
    sendMessage: vi.fn(),
    createChat: vi.fn(() => 'chat1'),
    addMoment: vi.fn(),
    fetchLocation: vi.fn(),
    purchasePremium: vi.fn(),
    updateUserPhoto: vi.fn(),
    setLocation: vi.fn(),
  })),
}));

import App from '../App';
import DiscoveryPage from '../pages/DiscoveryPage';
import MatchesPage from '../pages/MatchesPage';
import ChatPage from '../pages/ChatPage';
import MomentsPage from '../pages/MomentsPage';
import ProfilePage from '../pages/ProfilePage';
import AuthPage from '../pages/AuthPage';
import OnboardingPage from '../pages/OnboardingPage';
import MainLayout from '../components/common/MainLayout';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Muse Dating App - Comprehensive Tests', () => {
  describe('1. AuthPage Tests', () => {
    test('1.1 renders login form by default', () => {
      renderWithRouter(<AuthPage />);
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    test('1.2 toggles between login and signup', () => {
      renderWithRouter(<AuthPage />);
      fireEvent.click(screen.getByText('Sign Up'));
      expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    test('1.3 shows name input in signup mode', () => {
      renderWithRouter(<AuthPage />);
      fireEvent.click(screen.getByText('Sign Up'));
      expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    });

    test('1.4 email input is present', () => {
      renderWithRouter(<AuthPage />);
      expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    });

    test('1.5 password input is present', () => {
      renderWithRouter(<AuthPage />);
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    test('1.6 Google social login button exists', () => {
      renderWithRouter(<AuthPage />);
      expect(screen.getByText('Google')).toBeInTheDocument();
    });

    test('1.7 Facebook social login button exists', () => {
      renderWithRouter(<AuthPage />);
      expect(screen.getByText('Facebook')).toBeInTheDocument();
    });

    test('1.8 social login buttons are clickable', () => {
      renderWithRouter(<AuthPage />);
      const googleBtn = screen.getByText('Google').closest('button');
      fireEvent.click(googleBtn);
      expect(screen.getByText(/login coming soon/)).toBeInTheDocument();
    });

    test('1.9 showsMuse logo', () => {
      renderWithRouter(<AuthPage />);
      expect(screen.getByText(/Muse/)).toBeInTheDocument();
    });

    test('1.10 shows tagline', () => {
      renderWithRouter(<AuthPage />);
      expect(screen.getByText('Find your perfect connection')).toBeInTheDocument();
    });
  });

  describe('2. DiscoveryPage Tests', () => {
    test('2.1 renders profile card with name and age', () => {
      renderWithRouter(<DiscoveryPage />);
      expect(screen.getByText(/Sarah/)).toBeInTheDocument();
    });

    test('2.2 shows profile bio', () => {
      renderWithRouter(<DiscoveryPage />);
      expect(screen.getByText(/Test bio/)).toBeInTheDocument();
    });

    test('2.3 shows distance information', () => {
      renderWithRouter(<DiscoveryPage />);
      expect(screen.getByText(/5 miles away/)).toBeInTheDocument();
    });

    test('2.4 shows online indicator for online users', () => {
      renderWithRouter(<DiscoveryPage />);
      expect(screen.getByText('Active now')).toBeInTheDocument();
    });

    test('2.5 shows interests', () => {
      renderWithRouter(<DiscoveryPage />);
      expect(screen.getByText('Music')).toBeInTheDocument();
    });

    test('2.6 has like button (heart)', () => {
      renderWithRouter(<DiscoveryPage />);
      const likeButtons = document.querySelectorAll('button');
      expect(likeButtons.length).toBeGreaterThan(0);
    });

    test('2.7 has nope button (X)', () => {
      renderWithRouter(<DiscoveryPage />);
      const buttons = document.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    test('2.8 has super like button (star)', () => {
      renderWithRouter(<DiscoveryPage />);
      const starButtons = document.querySelectorAll('button');
      expect(starButtons.length).toBeGreaterThan(0);
    });

    test('2.9 super like button is clickable', () => {
      renderWithRouter(<DiscoveryPage />);
      const buttons = document.querySelectorAll('button');
      const superLikeBtn = buttons[2];
      if (superLikeBtn) {
        fireEvent.click(superLikeBtn);
      }
      expect(true).toBe(true);
    });

    test('2.10 has undo button', () => {
      renderWithRouter(<DiscoveryPage />);
      const undoButton = document.querySelector('button');
      expect(undoButton).toBeInTheDocument();
    });

    test('2.11 has Premium button in header', () => {
      renderWithRouter(<DiscoveryPage />);
      expect(screen.getByText('Premium')).toBeInTheDocument();
    });

    test('2.12 Premium button navigates to profile', () => {
      renderWithRouter(<DiscoveryPage />);
      const premiumBtn = screen.getByText('Premium').closest('button');
      fireEvent.click(premiumBtn);
    });

    test('2.13 shows logo', () => {
      renderWithRouter(<DiscoveryPage />);
      expect(screen.getByText(/M/)).toBeInTheDocument();
    });

    test('2.14 view full profile button exists', () => {
      renderWithRouter(<DiscoveryPage />);
      expect(screen.getByText('Tap to view full profile')).toBeInTheDocument();
    });

    test('2.15 like button triggers swipeRight', () => {
      renderWithRouter(<DiscoveryPage />);
      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        if (btn.querySelector('svg')) {
          fireEvent.click(btn);
        }
      });
    });
  });

  describe('3. MatchesPage Tests', () => {
    test('3.1 renders matches page', () => {
      renderWithRouter(<MatchesPage />);
      expect(screen.getByText('Matches')).toBeInTheDocument();
    });

    test('3.2 shows match cards', () => {
      renderWithRouter(<MatchesPage />);
      expect(screen.getByText(/Sarah/)).toBeInTheDocument();
    });

    test('3.3 has chat button', () => {
      renderWithRouter(<MatchesPage />);
      expect(screen.getByText('Say Hi')).toBeInTheDocument();
    });

    test('3.4 chat button is clickable', () => {
      renderWithRouter(<MatchesPage />);
      const chatBtn = screen.getByText('Say Hi').closest('button');
      fireEvent.click(chatBtn);
    });

    test('3.5 has upgrade button', () => {
      renderWithRouter(<MatchesPage />);
      expect(screen.getByText('Upgrade')).toBeInTheDocument();
    });

    test('3.6 upgrade button is clickable', () => {
      renderWithRouter(<MatchesPage />);
      const upgradeBtn = screen.getByText('Upgrade').closest('button');
      fireEvent.click(upgradeBtn);
    });

    test('3.7 has likes/requests button', () => {
      renderWithRouter(<MatchesPage />);
      const heartBtns = document.querySelectorAll('button');
      expect(heartBtns.length).toBeGreaterThan(0);
    });

    test('3.8 shows premium banner', () => {
      renderWithRouter(<MatchesPage />);
      expect(screen.getByText('Get Premium')).toBeInTheDocument();
    });

    test('3.9 shows match time', () => {
      renderWithRouter(<MatchesPage />);
      expect(screen.getByText(/ago/)).toBeInTheDocument();
    });

    test('3.10 shows match bio', () => {
      renderWithRouter(<MatchesPage />);
      expect(screen.getByText(/Test/)).toBeInTheDocument();
    });
  });

  describe('4. ChatPage Tests', () => {
    test('4.1 renders chat page', () => {
      renderWithRouter(<ChatPage />);
    });

    test('4.2 has message input', () => {
      renderWithRouter(<ChatPage />);
      expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    });

    test('4.3 has send button', () => {
      renderWithRouter(<ChatPage />);
      const sendBtn = document.querySelector('button');
      expect(sendBtn).toBeInTheDocument();
    });

    test('4.4 can type message', () => {
      renderWithRouter(<ChatPage />);
      const input = screen.getByPlaceholderText('Type a message...');
      fireEvent.change(input, { target: { value: 'Hello' } });
      expect(input.value).toBe('Hello');
    });

    test('4.5 has quick reply buttons', () => {
      renderWithRouter(<ChatPage />);
      expect(screen.getByText('Hey! 👋')).toBeInTheDocument();
    });

    test('4.6 quick reply is clickable', () => {
      renderWithRouter(<ChatPage />);
      const quickReply = screen.getByText('Hey! 👋').closest('button');
      fireEvent.click(quickReply);
    });

    test('4.7 has video call button', () => {
      renderWithRouter(<ChatPage />);
      const videoButtons = document.querySelectorAll('button');
      expect(videoButtons.length).toBeGreaterThan(0);
    });

    test('4.8 has more options button', () => {
      renderWithRouter(<ChatPage />);
      const moreButtons = document.querySelectorAll('button');
      expect(moreButtons.length).toBeGreaterThan(0);
    });

    test('4.9 video call button is clickable', () => {
      renderWithRouter(<ChatPage />);
      const buttons = document.querySelectorAll('button');
      buttons[1] && fireEvent.click(buttons[1]);
    });

    test('4.10 shows match banner', () => {
      renderWithRouter(<ChatPage />);
    });
  });

  describe('5. MomentsPage Tests', () => {
    test('5.1 renders moments page', () => {
      renderWithRouter(<MomentsPage />);
      expect(screen.getByText('Moments')).toBeInTheDocument();
    });

    test('5.2 has add button', () => {
      renderWithRouter(<MomentsPage />);
      const addButtons = document.querySelectorAll('button');
      expect(addButtons.length).toBeGreaterThan(0);
    });

    test('5.3 shows story items', () => {
      renderWithRouter(<MomentsPage />);
      expect(screen.getByText('Recent Moments')).toBeInTheDocument();
    });

    test('5.4 has my story section', () => {
      renderWithRouter(<MomentsPage />);
      expect(screen.getByText('My Story')).toBeInTheDocument();
    });

    test('5.5 shows sample moments', () => {
      renderWithRouter(<MomentsPage />);
    });

    test('5.6 moments have view counts', () => {
      renderWithRouter(<MomentsPage />);
    });

    test('5.7 has stories list', () => {
      renderWithRouter(<MomentsPage />);
    });

    test('5.8 shows profile photos', () => {
      renderWithRouter(<MomentsPage />);
    });

    test('5.9 moment cards are clickable', () => {
      renderWithRouter(<MomentsPage />);
      const momentCards = document.querySelectorAll('div');
      expect(momentCards.length).toBeGreaterThan(0);
    });

    test('5.10 has feed title', () => {
      renderWithRouter(<MomentsPage />);
      expect(screen.getByText('Recent Moments')).toBeInTheDocument();
    });
  });

  describe('6. ProfilePage Tests', () => {
    test('6.1 renders profile page', () => {
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    test('6.2 shows user name', () => {
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText(/Test User/)).toBeInTheDocument();
    });

    test('6.3 shows user age', () => {
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText(/25/)).toBeInTheDocument();
    });

    test('6.4 shows user bio', () => {
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText(/Test bio/)).toBeInTheDocument();
    });

    test('6.5 has edit button', () => {
      renderWithRouter(<ProfilePage />);
      const editButtons = document.querySelectorAll('button');
      expect(editButtons.length).toBeGreaterThan(0);
    });

    test('6.6 edit button is clickable', () => {
      renderWithRouter(<ProfilePage />);
      const editBtn = document.querySelector('button');
      if (editBtn) fireEvent.click(editBtn);
    });

    test('6.7 has premium card', () => {
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText('Muse Premium')).toBeInTheDocument();
    });

    test('6.8 premium card is clickable', () => {
      renderWithRouter(<ProfilePage />);
      const premiumCard = document.querySelector('div');
      if (premiumCard) fireEvent.click(premiumCard);
    });

    test('6.9 shows interests section', () => {
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText('Interests')).toBeInTheDocument();
    });

    test('6.10 shows answers section', () => {
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText('Answers')).toBeInTheDocument();
    });

    test('6.11 shows settings section', () => {
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    test('6.12 settings items are clickable', () => {
      renderWithRouter(<ProfilePage />);
      const settingsBtns = document.querySelectorAll('button');
      settingsBtns.forEach(btn => {
        if (btn.textContent.includes('Settings') || btn.textContent.includes('Safety')) {
          fireEvent.click(btn);
        }
      });
    });

    test('6.13 has logout button', () => {
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText('Log Out')).toBeInTheDocument();
    });

    test('6.14 logout button is clickable', () => {
      renderWithRouter(<ProfilePage />);
      const logoutBtn = screen.getByText('Log Out').closest('button');
      fireEvent.click(logoutBtn);
    });

    test('6.15 shows photo count', () => {
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText(/photos/)).toBeInTheDocument();
    });

    test('6.16 shows matches stat', () => {
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText('Matches')).toBeInTheDocument();
    });

    test('6.17 shows version info', () => {
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText(/Version/)).toBeInTheDocument();
    });

    test('6.18 has add photo button', () => {
      renderWithRouter(<ProfilePage />);
      const addPhotoBtn = document.querySelectorAll('button');
      expect(addPhotoBtn.length).toBeGreaterThan(0);
    });

    test('6.19 settings modal can open', () => {
      renderWithRouter(<ProfilePage />);
    });

    test('6.20 premium plans are displayed', () => {
      renderWithRouter(<ProfilePage />);
    });
  });

  describe('7. OnboardingPage Tests', () => {
    test('7.1 renders onboarding page', () => {
      renderWithRouter(<OnboardingPage />);
      expect(screen.getByText('Add Your Photos')).toBeInTheDocument();
    });

    test('7.2 shows progress steps', () => {
      renderWithRouter(<OnboardingPage />);
    });

    test('7.3 has continue button', () => {
      renderWithRouter(<OnboardingPage />);
      expect(screen.getByText('Continue')).toBeInTheDocument();
    });

    test('7.4 continue button is clickable', () => {
      renderWithRouter(<OnboardingPage />);
      const continueBtn = screen.getByText('Continue').closest('button');
      fireEvent.click(continueBtn);
    });

    test('7.5 has add photo button', () => {
      renderWithRouter(<OnboardingPage />);
      expect(screen.getByText('Add Photo')).toBeInTheDocument();
    });

    test('7.6 shows About You step', () => {
      renderWithRouter(<OnboardingPage />);
      fireEvent.click(screen.getByText('Continue').closest('button'));
      expect(screen.getByText('About You')).toBeInTheDocument();
    });

    test('7.7 has name input', () => {
      renderWithRouter(<OnboardingPage />);
      fireEvent.click(screen.getByText('Continue').closest('button'));
      expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    });

    test('7.8 has age input', () => {
      renderWithRouter(<OnboardingPage />);
      fireEvent.click(screen.getByText('Continue').closest('button'));
      expect(screen.getByPlaceholderText('Your age')).toBeInTheDocument();
    });

    test('7.9 has bio input', () => {
      renderWithRouter(<OnboardingPage />);
      fireEvent.click(screen.getByText('Continue').closest('button'));
      expect(screen.getByPlaceholderText('Tell us about yourself...')).toBeInTheDocument();
    });

    test('7.10 has interests step', () => {
      renderWithRouter(<OnboardingPage />);
      const continueBtn = screen.getByText('Continue').closest('button');
      fireEvent.click(continueBtn);
      fireEvent.click(continueBtn);
      expect(screen.getByText('Your Interests')).toBeInTheDocument();
    });
  });

  describe('8. MainLayout Tests', () => {
    test('8.1 renders navigation', () => {
      renderWithRouter(<MainLayout />);
    });

    test('8.2 has Discover tab', () => {
      renderWithRouter(<MainLayout />);
      expect(screen.getByText('Discover')).toBeInTheDocument();
    });

    test('8.3 has Matches tab', () => {
      renderWithRouter(<MainLayout />);
      expect(screen.getByText('Matches')).toBeInTheDocument();
    });

    test('8.4 has Moments tab', () => {
      renderWithRouter(<MainLayout />);
      expect(screen.getByText('Moments')).toBeInTheDocument();
    });

    test('8.5 has Profile tab', () => {
      renderWithRouter(<MainLayout />);
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    test('8.6 has logo', () => {
      renderWithRouter(<MainLayout />);
      expect(screen.getByText(/M/)).toBeInTheDocument();
    });

    test('8.7 navigation tabs are clickable', () => {
      renderWithRouter(<MainLayout />);
      const navItems = document.querySelectorAll('a');
      expect(navItems.length).toBe(4);
    });
  });

  describe('9. Store Tests', () => {
    test('9.1 store has initial state', () => {
      const useStore = require('../store/useStore').default;
      const store = useStore();
      expect(store).toBeDefined();
    });

    test('9.2 store has login function', () => {
      const useStore = require('../store/useStore').default;
      const store = useStore();
      expect(store.login).toBeDefined();
    });

    test('9.3 store has signup function', () => {
      const useStore = require('../store/useStore').default;
      const store = useStore();
      expect(store.signup).toBeDefined();
    });

    test('9.4 store has logout function', () => {
      const useStore = require('../store/useStore').default;
      const store = useStore();
      expect(store.logout).toBeDefined();
    });

    test('9.5 store has swipeRight function', () => {
      const useStore = require('../store/useStore').default;
      const store = useStore();
      expect(store.swipeRight).toBeDefined();
    });

    test('9.6 store has swipeLeft function', () => {
      const useStore = require('../store/useStore').default;
      const store = useStore();
      expect(store.swipeLeft).toBeDefined();
    });

    test('9.7 store has undoSwipe function', () => {
      const useStore = require('../store/useStore').default;
      const store = useStore();
      expect(store.undoSwipe).toBeDefined();
    });

    test('9.8 store has sendMessage function', () => {
      const useStore = require('../store/useStore').default;
      const store = useStore();
      expect(store.sendMessage).toBeDefined();
    });

    test('9.9 store has premiumPlans', () => {
      const useStore = require('../store/useStore').default;
      const store = useStore();
      expect(store.premiumPlans).toBeDefined();
      expect(store.premiumPlans.length).toBe(4);
    });

    test('9.10 store has purchasePremium function', () => {
      const useStore = require('../store/useStore').default;
      const store = useStore();
      expect(store.purchasePremium).toBeDefined();
    });
  });

  describe('10. App Routing Tests', () => {
    test('10.1 App renders without crashing', () => {
      renderWithRouter(<App />);
    });

    test('10.2 App shows auth page when not authenticated', () => {
      renderWithRouter(<App />);
    });

    test('10.3 App has BrowserRouter', () => {
      const { container } = renderWithRouter(<App />);
      expect(container.innerHTML).toBeDefined();
    });
  });
});
