import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ChatPage from '../pages/ChatPage';
import useStore from '../store/useStore';

vi.mock('../store/useStore', () => ({
  default: vi.fn((selector) => {
    const mockChat = {
      id: 'chat-1',
      matchedProfile: { id: 'u1', name: 'Sarah', photos: ['https://picsum.photos/seed/sarah/200/200'], online: true },
      lastMessage: 'Hello!',
      lastMessageTime: '2024-01-01T12:00:00Z',
      unreadCount: 0
    };
    const state = {
      chats: [mockChat],
      messages: { 'chat-1': [] },
      sendMessage: vi.fn(),
    };
    return selector ? selector(state) : state;
  })
}));

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter initialEntries={['/chat/chat-1']}>
      <Routes>
        <Route path="/chat/:chatId" element={component} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ChatPage - Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render chat header', () => {
      renderWithRouter(<ChatPage />);
      expect(screen.getByText('Sarah')).toBeTruthy();
    });

    it('should render Active now status', () => {
      renderWithRouter(<ChatPage />);
      expect(screen.getByText('Active now')).toBeTruthy();
    });

    it('should render message input', () => {
      renderWithRouter(<ChatPage />);
      expect(screen.getByPlaceholderText('Type a message...')).toBeTruthy();
    });

    it('should render send button', () => {
      renderWithRouter(<ChatPage />);
      const sendButton = document.querySelector('button');
      expect(sendButton).toBeTruthy();
    });

    it('should render quick reply buttons', () => {
      renderWithRouter(<ChatPage />);
      expect(screen.getByText('Hey! 👋')).toBeTruthy();
    });

    it('should render match banner', () => {
      renderWithRouter(<ChatPage />);
      expect(screen.getByText(/matched with/)).toBeTruthy();
    });
  });

  describe('Input Field', () => {
    it('should have input field', () => {
      renderWithRouter(<ChatPage />);
      const input = screen.getByPlaceholderText('Type a message...');
      expect(input).toBeTruthy();
    });

    it('should have mic button', () => {
      renderWithRouter(<ChatPage />);
      const micButton = document.querySelector('button');
      expect(micButton).toBeTruthy();
    });
  });
});
