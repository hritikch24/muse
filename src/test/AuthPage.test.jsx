import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';

// Mock store
vi.mock('../store/useStore', () => ({
  default: vi.fn(() => ({
    login: vi.fn(() => true),
    signup: vi.fn(() => true),
  })),
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AuthPage - Basic Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderWithRouter(<AuthPage />);
    const container = document.querySelector('div[style*="min-height"]');
    expect(container).toBeTruthy();
  });

  it('should render email input field', () => {
    renderWithRouter(<AuthPage />);
    const emailInput = screen.getByPlaceholderText('Email address');
    expect(emailInput).toBeTruthy();
  });

  it('should render password input field', () => {
    renderWithRouter(<AuthPage />);
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toBeTruthy();
  });

  it('should have email input with correct type', () => {
    renderWithRouter(<AuthPage />);
    const emailInput = screen.getByPlaceholderText('Email address');
    expect(emailInput.type).toBe('email');
  });

  it('should have password input with correct type', () => {
    renderWithRouter(<AuthPage />);
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput.type).toBe('password');
  });

  it('should render Google button', () => {
    renderWithRouter(<AuthPage />);
    expect(screen.getByText('Google')).toBeInTheDocument();
  });

  it('should render Facebook button', () => {
    renderWithRouter(<AuthPage />);
    expect(screen.getByText('Facebook')).toBeInTheDocument();
  });

  it('should render signup link text', () => {
    renderWithRouter(<AuthPage />);
    expect(screen.getByText(/Sign up/)).toBeTruthy();
  });
});

describe('AuthPage - Form Validation', () => {
  it('should have required attribute on email', () => {
    renderWithRouter(<AuthPage />);
    const emailInput = screen.getByPlaceholderText('Email address');
    expect(emailInput.required).toBe(true);
  });

  it('should have required attribute on password', () => {
    renderWithRouter(<AuthPage />);
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput.required).toBe(true);
  });

  it('should have minLength of 6 on password', () => {
    renderWithRouter(<AuthPage />);
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput.minLength).toBe(6);
  });
});

describe('AuthPage - Input Fields', () => {
  it('should accept email input', () => {
    renderWithRouter(<AuthPage />);
    const emailInput = screen.getByPlaceholderText('Email address');
    emailInput.value = 'test@example.com';
    expect(emailInput.value).toBe('test@example.com');
  });

  it('should accept password input', () => {
    renderWithRouter(<AuthPage />);
    const passwordInput = screen.getByPlaceholderText('Password');
    passwordInput.value = 'password123';
    expect(passwordInput.value).toBe('password123');
  });
});
