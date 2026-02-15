import { motion } from 'framer-motion';
import { FaPhone, FaPhoneSlash, FaVideo } from 'react-icons/fa';

const IncomingCallModal = ({ caller, callType, onAccept, onReject }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.overlay}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        style={styles.modal}
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={styles.avatarContainer}
        >
          <img
            src={caller?.photos?.[0] || 'https://randomuser.me/api/portraits/women/1.jpg'}
            alt={caller?.name || 'Caller'}
            style={styles.avatar}
          />
        </motion.div>

        <h2 style={styles.callerName}>
          {caller?.name || 'Unknown'}
        </h2>

        <div style={styles.callTypeContainer}>
          {callType === 'video' ? (
            <>
              <FaVideo size={16} />
              <span>Incoming video call</span>
            </>
          ) : (
            <>
              <FaPhone size={16} />
              <span>Incoming voice call</span>
            </>
          )}
        </div>

        <div style={styles.actions}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onReject}
            style={styles.rejectBtn}
          >
            <FaPhoneSlash size={24} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onAccept}
            style={styles.acceptBtn}
          >
            <FaPhone size={28} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
    padding: '20px',
  },
  modal: {
    background: '#1a1a1a',
    borderRadius: '24px',
    padding: '40px',
    maxWidth: '320px',
    width: '100%',
    textAlign: 'center',
  },
  avatarContainer: {
    width: '100px',
    height: '100px',
    margin: '0 auto 16px',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #FF6B9D',
  },
  callerName: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  callTypeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '32px',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
  },
  rejectBtn: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: '#F44336',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: '#4CAF50',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(76, 175, 80, 0.5)',
  },
};

export default IncomingCallModal;
