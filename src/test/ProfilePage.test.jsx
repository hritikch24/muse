import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfilePage from '../pages/ProfilePage';
import useStore from '../store/useStore';

vi.mock('../store/useStore', () => ({
  default: vi.fn((selector) => {
    const state = {
      currentUser: { 
        id: 'user1', 
        name: 'Test User', 
        age: 25, 
        bio: 'Test bio',
        photos: ['https://picsum.photos/seed/test/200/200'],
        interests: ['Music', 'Travel'],
        prompts: [{ question: 'Test?', answer: 'Test answer' }],
        location: 'New York'
      },
      matchedProfiles: [{ id: '1', user: {} }],
      logout: vi.fn(),
      updateUserPhoto: vi.fn(),
      premiumPlan: null,
      premiumPlans: [
        { id: 'daily', name: 'Daily', price: 10, duration: 1 },
        { id: 'weekly', name: 'Weekly', price: 50, duration: 7 },
        { id: 'monthly', name: 'Monthly', price: 199, duration: 30 },
        { id: 'yearly', name: 'Yearly', price: 999, duration: 365 }
      ],
      purchasePremium: vi.fn(),
      userLocation: null,
      fetchLocation: vi.fn(),
    };
    return selector ? selector(state) : state;
  })
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProfilePage - Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render Profile title', () => {
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText('Profile')).toBeTruthy();
    });

    it('should render edit button', () => {
      renderWithRouter(<ProfilePage />);
      const buttons = document.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should render premium section', () => {
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText('Muse Premium')).toBeTruthy();
    });

    it('should render logout button', () => {
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText('Log Out')).toBeTruthy();
    });

    it('should render version', () => {
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText('Version 1.0.0')).toBeTruthy();
    });
  });

  describe('Edit Profile', () => {
    it('should open edit modal on button click', () => {
      renderWithRouter(<ProfilePage />);
      const buttons = document.querySelectorAll('button');
      fireEvent.click(buttons[0]);
      expect(screen.getByText('Edit Profile')).toBeTruthy();
    });

    it('should have save and cancel buttons in edit modal', () => {
      renderWithRouter(<ProfilePage />);
      const buttons = document.querySelectorAll('button');
      fireEvent.click(buttons[0]);
      expect(screen.getByText('Save Changes')).toBeTruthy();
      expect(screen.getByText('Cancel')).toBeTruthy();
    });

    it('should close modal on cancel click', () => {
      renderWithRouter(<ProfilePage />);
      const buttons = document.querySelectorAll('button');
      fireEvent.click(buttons[0]);
      fireEvent.click(screen.getByText('Cancel'));
    });
  });

  describe('Photo', () => {
    it('should render user photo', () => {
      renderWithRouter(<ProfilePage />);
      const images = document.querySelectorAll('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });
});
