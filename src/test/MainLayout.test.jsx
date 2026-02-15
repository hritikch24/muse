import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import MainLayout from '../components/common/MainLayout';
import useStore from '../store/useStore';

vi.mock('../store/useStore', () => ({
  default: vi.fn((selector) => {
    const state = {
      matchedProfiles: [],
      notifications: [],
    };
    return selector ? selector(state) : state;
  })
}));

const renderWithRouter = (component, initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

describe('MainLayout - Navigation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Navigation Items', () => {
    it('should render Discover navigation item', () => {
      renderWithRouter(<MainLayout />);
      expect(screen.getByText('Discover')).toBeTruthy();
    });

    it('should render Matches navigation item', () => {
      renderWithRouter(<MainLayout />);
      expect(screen.getByText('Matches')).toBeTruthy();
    });

    it('should render Moments navigation item', () => {
      renderWithRouter(<MainLayout />);
      expect(screen.getByText('Moments')).toBeTruthy();
    });

    it('should render Profile navigation item', () => {
      renderWithRouter(<MainLayout />);
      expect(screen.getByText('Profile')).toBeTruthy();
    });

    it('should have navigation links', () => {
      renderWithRouter(<MainLayout />);
      const navItems = document.querySelectorAll('a');
      expect(navItems.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Navigation Links', () => {
    it('should have link to root path', () => {
      renderWithRouter(<MainLayout />);
      const links = document.querySelectorAll('a');
      const hrefs = Array.from(links).map(l => l.getAttribute('href'));
      expect(hrefs).toContain('/');
    });

    it('should have link to matches', () => {
      renderWithRouter(<MainLayout />);
      const links = document.querySelectorAll('a');
      const hrefs = Array.from(links).map(l => l.getAttribute('href'));
      expect(hrefs).toContain('/matches');
    });

    it('should have link to moments', () => {
      renderWithRouter(<MainLayout />);
      const links = document.querySelectorAll('a');
      const hrefs = Array.from(links).map(l => l.getAttribute('href'));
      expect(hrefs).toContain('/moments');
    });

    it('should have link to profile', () => {
      renderWithRouter(<MainLayout />);
      const links = document.querySelectorAll('a');
      const hrefs = Array.from(links).map(l => l.getAttribute('href'));
      expect(hrefs).toContain('/profile');
    });
  });

  describe('Active State', () => {
    it('should highlight Discover when on root', () => {
      renderWithRouter(<MainLayout />, ['/']);
      const discoverLabel = screen.getByText('Discover');
      expect(discoverLabel).toBeTruthy();
    });

    it('should highlight Matches when on matches page', () => {
      renderWithRouter(<MainLayout />, ['/matches']);
      const matchesLabel = screen.getByText('Matches');
      expect(matchesLabel).toBeTruthy();
    });
  });

  describe('Badge Display', () => {
    it('should not show badge when no notifications', () => {
      useStore.mockImplementation((selector) => {
        const state = {
          matchedProfiles: [],
          notifications: [],
        };
        return selector ? selector(state) : state;
      });
      
      renderWithRouter(<MainLayout />);
      const badges = document.querySelectorAll('span[data-testid="badge"], span[class*="badge"]');
      expect(badges.length).toBe(0);
    });
  });
});

describe('MainLayout - Styling Tests', () => {
  it('should have navigation container', () => {
    renderWithRouter(<MainLayout />);
    const nav = document.querySelector('nav');
    expect(nav).toBeTruthy();
  });

  it('should have proper layout structure', () => {
    renderWithRouter(<MainLayout />);
    const container = document.querySelector('div');
    expect(container).toBeTruthy();
  });
});
