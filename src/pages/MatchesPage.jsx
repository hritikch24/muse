import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaComment, FaTimes } from 'react-icons/fa';
import useStore from '../store/useStore';
import '../styles/globals.css';

export default function MatchesPage() {
  const matchedProfiles = useStore(state => state.matchedProfiles);
  const createChat = useStore(state => state.createChat);
  const [showRequests, setShowRequests] = useState(false);
  const navigate = useNavigate();

  const requests = [
    { id: 1, name: 'Jessica', photo: 'https://picsum.photos/seed/req1/200/200', time: '2h ago' },
    { id: 2, name: 'Amanda', photo: 'https://picsum.photos/seed/req2/200/200', time: '5h ago' },
    { id: 3, name: 'Rachel', photo: 'https://picsum.photos/seed/req3/200/200', time: '1d ago' },
  ];

  const handleStartChat = (match) => {
    const chatId = createChat(match.user);
    navigate(`/chat/${chatId}`);
  };

  const handleRequestAction = (requestId, action) => {
    console.log(`Request ${requestId} ${action}`);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Matches</h1>
        <button 
          style={styles.requestsBtn}
          onClick={() => setShowRequests(!showRequests)}
        >
          <FaHeart size={18} />
          {requests.length > 0 && (
            <span style={styles.requestsBadge}>{requests.length}</span>
          )}
        </button>
      </div>

      {/* Likes Requests */}
      <AnimatePresence>
        {showRequests && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={styles.requestsSection}
          >
            <p style={styles.requestsTitle}>Who Liked You</p>
            <div style={styles.requestsList}>
              {requests.map((request) => (
                <motion.div
                  key={request.id}
                  style={styles.requestCard}
                  whileHover={{ scale: 1.02 }}
                >
                  <img 
                    src={request.photo} 
                    alt="" 
                    style={styles.requestPhoto}
                  />
                  <div style={styles.requestInfo}>
                    <p style={styles.requestName}>{request.name}</p>
                    <p style={styles.requestTime}>{request.time}</p>
                  </div>
                  <div style={styles.requestActions}>
                    <button style={styles.requestActionBtn} onClick={() => handleRequestAction(request.id, 'reject')}>
                      <FaTimes size={16} />
                    </button>
                    <button style={{...styles.requestActionBtn, ...styles.requestActionBtnActive}} onClick={() => handleRequestAction(request.id, 'accept')}>
                      <FaHeart size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Matches List */}
      <div style={styles.matchesList}>
        {matchedProfiles.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>💕</span>
            <h2 style={styles.emptyTitle}>No matches yet</h2>
            <p style={styles.emptyText}>
              Keep swiping to find your perfect match!
            </p>
          </div>
        ) : (
          matchedProfiles.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={styles.matchCard}
              whileHover={{ scale: 1.01 }}
            >
              <div style={styles.matchImageWrapper}>
                <img 
                  src={match.user.photos[0]} 
                  alt={match.user.name}
                  style={styles.matchImage}
                />
              </div>
              <div style={styles.matchInfo}>
                <h3 style={styles.matchName}>{match.user.name}, {match.user.age}</h3>
                <p style={styles.matchBio}>{match.user.bio}</p>
                <button 
                  style={styles.chatBtn}
                  onClick={() => handleStartChat(match)}
                >
                  <FaComment size={14} />
                  Say Hi
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Premium Banner */}
      <div style={styles.premiumBanner}>
        <div style={styles.premiumContent}>
          <span style={styles.premiumIcon}>✨</span>
          <div>
            <p style={styles.premiumTitle}>Get Premium</p>
            <p style={styles.premiumText}>See who liked you & more!</p>
          </div>
        </div>
        <button style={styles.upgradeBtn} onClick={() => navigate('/profile')}>Upgrade</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100%',
    padding: 'var(--space-md)',
    overflowY: 'auto',
    background: 'var(--bg-dark)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-md)',
  },
  title: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 'var(--text-2xl)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  requestsBtn: {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-full)',
    background: 'rgba(255, 77, 109, 0.2)',
    border: 'none',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
  },
  requestsBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    minWidth: '18px',
    height: '18px',
    background: 'var(--primary)',
    borderRadius: '9px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestsSection: {
    marginBottom: 'var(--space-md)',
    overflow: 'hidden',
  },
  requestsTitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    marginBottom: 'var(--space-sm)',
    fontWeight: 500,
  },
  requestsList: {
    display: 'flex',
    gap: 'var(--space-sm)',
    overflowX: 'auto',
    paddingBottom: 'var(--space-sm)',
  },
  requestCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-sm)',
    background: 'var(--surface)',
    borderRadius: 'var(--radius-md)',
    minWidth: '240px',
    border: '1px solid var(--surface-glass-border)',
  },
  requestPhoto: {
    width: '56px',
    height: '56px',
    borderRadius: 'var(--radius-full)',
    objectFit: 'cover',
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  requestTime: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
  },
  requestActions: {
    display: 'flex',
    gap: 'var(--space-xs)',
  },
  requestActionBtn: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--surface-glass)',
    border: 'none',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  requestActionBtnActive: {
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
    color: '#fff',
  },
  matchesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  matchCard: {
    display: 'flex',
    gap: 'var(--space-md)',
    padding: 'var(--space-md)',
    background: 'var(--surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--surface-glass-border)',
  },
  matchImageWrapper: {
    width: '90px',
    height: '90px',
    flexShrink: 0,
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
  },
  matchImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  matchInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  matchName: {
    fontSize: 'var(--text-lg)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  matchBio: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    marginBottom: 'var(--space-sm)',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  chatBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 16px',
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    color: '#fff',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-xxl)',
    textAlign: 'center',
    minHeight: '300px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: 'var(--space-md)',
  },
  emptyTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 'var(--text-xl)',
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-xs)',
  },
  emptyText: {
    color: 'var(--text-muted)',
    fontSize: 'var(--text-base)',
  },
  premiumBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'var(--space-md)',
    padding: 'var(--space-md)',
    background: 'linear-gradient(135deg, rgba(255, 77, 109, 0.15), rgba(156, 39, 176, 0.15))',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid rgba(255, 77, 109, 0.3)',
  },
  premiumContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
  },
  premiumIcon: {
    fontSize: '24px',
  },
  premiumTitle: {
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  premiumText: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
  },
  upgradeBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    color: '#fff',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
