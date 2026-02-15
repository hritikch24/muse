import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaPaperPlane, FaMicrophone, FaVideo, FaPhone, FaEllipsisH, FaCheck, FaCheckDouble, FaBolt } from 'react-icons/fa';
import useStore from '../store/useStore';
import CallScreen from '../components/calls/CallScreen';
import '../styles/globals.css';

const ICEBREAKERS = [
  "Hey! How's your day going?",
  "What's the best advice you've ever received?",
  "If you could travel anywhere right now, where would you go?",
  "What's your go-to comfort food?",
  "What's something on your bucket list?",
  "What's your favorite way to spend a weekend?",
  "Tell me about your last vacation!",
  "What's your favorite movie or show currently?",
  "Coffee or tea?",
  "What's something you're passionate about?",
];

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showAudioCall, setShowAudioCall] = useState(false);
  const [showIcebreakers, setShowIcebreakers] = useState(false);

  const chats = useStore(state => state.chats);
  const messages = useStore(state => state.messages);
  const sendMessage = useStore(state => state.sendMessage);
  const initiateCall = useStore(state => state.initiateCall);
  const endCall = useStore(state => state.endCall);
  const callState = useStore(state => state.callState);

  const chat = chats.find(c => c.id === chatId);
  const chatMessages = messages[chatId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(chatId, message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVideoCall = () => {
    if (chat?.matchedProfile) {
      initiateCall(chat.matchedProfile.id, 'video');
      setShowVideoCall(true);
    }
  };

  const handleAudioCall = () => {
    if (chat?.matchedProfile) {
      initiateCall(chat.matchedProfile.id, 'audio');
      setShowAudioCall(true);
    }
  };

  const handleCallEnd = () => {
    endCall();
    setShowVideoCall(false);
    setShowAudioCall(false);
  };

  const handleIcebreaker = (text) => {
    sendMessage(chatId, text);
    setShowIcebreakers(false);
  };

  const handleViewProfile = () => {
    setShowActions(false);
    console.log('View profile');
  };

  const handleUnmatch = () => {
    setShowActions(false);
    console.log('Unmatch');
  };

  const handleBlock = () => {
    setShowActions(false);
    console.log('Block');
  };

  const handleReport = () => {
    setShowActions(false);
    console.log('Report');
  };

  if (!chat) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <FaArrowLeft size={20} />
          </button>
          <h2>Chat not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <FaArrowLeft size={20} />
        </button>
        <div style={styles.headerInfo}>
          <img 
            src={chat.matchedProfile.photos[0]} 
            alt="" 
            style={styles.headerPhoto}
          />
          <div>
            <h2 style={styles.headerName}>{chat.matchedProfile.name}</h2>
            <p style={styles.headerStatus}>
              {chat.matchedProfile.online ? 'Active now' : 'Last seen recently'}
            </p>
          </div>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.headerBtn} onClick={handleAudioCall} aria-label="Audio call">
            <FaPhone size={18} />
          </button>
          <button style={styles.headerBtn} onClick={handleVideoCall} aria-label="Video call">
            <FaVideo size={18} />
          </button>
          <button style={styles.headerBtn} onClick={() => setShowActions(!showActions)}>
            <FaEllipsisH size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messagesContainer}>
        <div style={styles.matchBanner}>
          <span style={styles.matchHeart}>❤️</span>
          <p>You matched with {chat.matchedProfile.name}!</p>
        </div>

        {chatMessages.map((msg, index) => {
          const isMe = msg.sender === 'me';
          const showTime = index === 0 || 
            new Date(msg.timestamp).getTime() - new Date(chatMessages[index-1].timestamp).getTime() > 300000;

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                ...styles.messageWrapper,
                justifyContent: isMe ? 'flex-end' : 'flex-start',
              }}
            >
              {!isMe && (
                <img 
                  src={chat.matchedProfile.photos[0]} 
                  alt="" 
                  style={styles.messageAvatar}
                />
              )}
              <div style={{
                ...styles.messageBubble,
                background: isMe ? 'linear-gradient(135deg, #E91E63, #FF6B9D)' : 'rgba(255,255,255,0.1)',
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              }}>
                <p style={styles.messageText}>{msg.text}</p>
                <div style={styles.messageMeta}>
                  <span style={styles.messageTime}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (
                    <span style={styles.messageStatus}>
                      {msg.read ? <FaCheckDouble size={12} /> : <FaCheck size={12} />}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Icebreakers */}
      <div style={styles.icebreakersSection}>
        <div style={styles.icebreakersHeader}>
          <FaBolt size={14} />
          <span>Icebreakers</span>
          <button style={styles.icebreakersToggle} onClick={() => setShowIcebreakers(!showIcebreakers)}>
            {showIcebreakers ? 'Hide' : 'Show'}
          </button>
        </div>
        {showIcebreakers && (
          <div style={styles.icebreakersList}>
            {ICEBREAKERS.slice(0, 5).map((icebreaker, index) => (
              <button
                key={index}
                style={styles.icebreakerBtn}
                onClick={() => handleIcebreaker(icebreaker)}
              >
                {icebreaker}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Replies */}
      <div style={styles.quickReplies}>
        {['Hey! 👋', 'How are you?', 'Tell me about yourself'].map((reply) => (
          <button
            key={reply}
            style={styles.quickReply}
            onClick={() => {
              sendMessage(chatId, reply);
            }}
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={styles.inputContainer}>
        <button style={styles.micBtn}>
          <FaMicrophone size={20} />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={styles.input}
        />
        <motion.button
          style={{
            ...styles.sendBtn,
            opacity: message.trim() ? 1 : 0.5,
          }}
          onClick={handleSend}
          disabled={!message.trim()}
          whileTap={{ scale: 0.9 }}
        >
          <FaPaperPlane size={18} />
        </motion.button>
      </div>

      {/* Action Sheet */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.actionOverlay}
            onClick={() => setShowActions(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              style={styles.actionSheet}
              onClick={e => e.stopPropagation()}
            >
              <button style={styles.actionItem} onClick={handleViewProfile}>👤 View Profile</button>
              <button style={styles.actionItem} onClick={handleUnmatch}>🔇 Unmatch</button>
              <button style={styles.actionItem} onClick={handleBlock}>🚫 Block</button>
              <button style={styles.actionItem} onClick={handleReport}>⚠️ Report</button>
              <button style={{...styles.actionItem, color: '#F44336'}} onClick={() => setShowActions(false)}>Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video/Audio Call Screen */}
      <AnimatePresence>
        {showVideoCall && (
          <CallScreen
            match={chat.matchedProfile}
            callType="video"
            onEnd={handleCallEnd}
          />
        )}
        {showAudioCall && (
          <CallScreen
            match={chat.matchedProfile}
            callType="audio"
            onEnd={handleCallEnd}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#1A1A2E',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'rgba(26, 26, 46, 0.95)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  backBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  headerInfo: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerPhoto: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  headerName: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
  },
  headerStatus: {
    fontSize: '13px',
    color: '#4CAF50',
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
  },
  headerBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  messagesContainer: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  matchBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    background: 'rgba(233,30,99,0.15)',
    borderRadius: '20px',
    marginBottom: '16px',
    alignSelf: 'center',
  },
  matchHeart: {
    fontSize: '20px',
  },
  messageWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
  },
  messageAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '12px 16px',
  },
  messageText: {
    fontSize: '15px',
    color: '#fff',
    lineHeight: 1.4,
  },
  messageMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '4px',
    marginTop: '4px',
  },
  messageTime: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.6)',
  },
  messageStatus: {
    color: 'rgba(255,255,255,0.6)',
  },
  icebreakersSection: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.03)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  icebreakersHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#FF6B9D',
    fontSize: '13px',
    fontWeight: 500,
  },
  icebreakersToggle: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '12px',
    cursor: 'pointer',
  },
  icebreakersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '10px',
  },
  icebreakerBtn: {
    padding: '12px 16px',
    background: 'rgba(255,215,0,0.1)',
    border: '1px solid rgba(255,215,0,0.2)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '13px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  quickReplies: {
    display: 'flex',
    gap: '8px',
    padding: '8px 16px',
    overflowX: 'auto',
  },
  quickReply: {
    padding: '8px 14px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '20px',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'rgba(26, 26, 46, 0.95)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  micBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  input: {
    flex: 1,
    padding: '14px 20px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '24px',
    fontSize: '16px',
    color: '#fff',
    outline: 'none',
    minHeight: '48px',
  },
  sendBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  actionOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    zIndex: 100,
  },
  actionSheet: {
    width: '100%',
    background: '#1A1A2E',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    padding: '8px',
  },
  actionItem: {
    width: '100%',
    padding: '16px',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    textAlign: 'center',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  videoCallToast: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(0,0,0,0.8)',
    padding: '20px 40px',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    zIndex: 300,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
};
