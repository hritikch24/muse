import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MomentsPage from '../pages/MomentsPage';

vi.mock('../store/useStore', () => ({
  default: vi.fn(() => ({
    currentUser: {
      id: 'user-1',
      name: 'Test User',
      photos: ['https://picsum.photos/seed/me/200/200'],
    },
    addMoment: vi.fn(),
  })),
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('MomentsPage - Basic Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the page container', () => {
    renderWithRouter(<MomentsPage />);
    const container = document.querySelector('div[style*="height: 100%"]');
    expect(container).toBeTruthy();
  });

  it('should render Moments title', () => {
    renderWithRouter(<MomentsPage />);
    expect(screen.getByText('Moments')).toBeInTheDocument();
  });

  it('should render My Story', () => {
    renderWithRouter(<MomentsPage />);
    expect(screen.getByText('My Story')).toBeInTheDocument();
  });
});
