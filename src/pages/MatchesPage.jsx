import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaComment, FaTimes, FaCheck, FaArrowLeft } from 'react-icons/fa';
import useStore from '../store/useStore';
import { formatDistanceToNow } from 'date-fns';
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

  const handleUpgradeClick = () => {
    navigate('/profile');
  };

  const handleRequestAction = (requestId, action) => {
    console.log(`Request ${requestId} ${action}`);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Matches</h1>
        <div style={styles.headerActions}>
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

      {/* Matches Grid */}
      <div style={styles.matchesGrid}>
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
              whileHover={{ scale: 1.02 }}
            >
              <div style={styles.matchImageWrapper}>
                <img 
                  src={match.user.photos[0]} 
                  alt={match.user.name}
                  style={styles.matchImage}
                />
                <div style={styles.matchTime}>
                  {formatDistanceToNow(new Date(match.matchedAt), { addSuffix: true })}
                </div>
              </div>
              <div style={styles.matchInfo}>
                <h3 style={styles.matchName}>{match.user.name}, {match.user.age}</h3>
                <p style={styles.matchBio}>{match.user.bio}</p>
                <button 
                  style={styles.chatBtn}
                  onClick={() => handleStartChat(match)}
                >
                  <FaComment size={16} />
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
        <button style={styles.upgradeBtn} onClick={handleUpgradeClick}>Upgrade</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100%',
    padding: '20px',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    fontWeight: 600,
    color: '#fff',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
  },
  requestsBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'rgba(233,30,99,0.2)',
    border: 'none',
    color: '#FF6B9D',
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
    background: '#E91E63',
    borderRadius: '9px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestsSection: {
    marginBottom: '20px',
    overflow: 'hidden',
  },
  requestsTitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '12px',
    fontWeight: 500,
  },
  requestsList: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    paddingBottom: '10px',
  },
  requestCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '16px',
    minWidth: '280px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  requestPhoto: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#fff',
  },
  requestTime: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
  },
  requestActions: {
    display: 'flex',
    gap: '8px',
  },
  requestActionBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: 'rgba(255,255,255,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  requestActionBtnActive: {
    background: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
    color: '#fff',
  },
  matchesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  matchCard: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  matchImageWrapper: {
    position: 'relative',
    width: '100px',
    height: '100px',
    flexShrink: 0,
  },
  matchImage: {
    width: '100%',
    height: '100%',
    borderRadius: '16px',
    objectFit: 'cover',
  },
  matchTime: {
    position: 'absolute',
    bottom: '6px',
    left: '6px',
    background: 'rgba(0,0,0,0.7)',
    padding: '3px 8px',
    borderRadius: '8px',
    fontSize: '10px',
    color: '#fff',
  },
  matchInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  matchName: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '4px',
  },
  matchBio: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 'auto',
    lineHeight: 1.4,
  },
  chatBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '10px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '60px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '22px',
    color: '#fff',
    marginBottom: '8px',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '15px',
  },
  premiumBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '20px',
    padding: '16px',
    background: 'linear-gradient(135deg, rgba(233,30,99,0.2), rgba(156,39,176,0.2))',
    borderRadius: '16px',
    border: '1px solid rgba(233,30,99,0.3)',
  },
  premiumContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  premiumIcon: {
    fontSize: '24px',
  },
  premiumTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#fff',
  },
  premiumText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
  },
  upgradeBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
