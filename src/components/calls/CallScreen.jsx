import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FaVideo, 
  FaVideoSlash, 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaPhoneSlash,
  FaSyncAlt,
  FaExpand,
  FaCompress,
  FaTimes
} from 'react-icons/fa';
import CallService from '../../services/calls/CallService';
import useStore from '../../store/useStore';

const CallScreen = ({ match, callType, onEnd }) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState(null);
  
  const localVideoRef = useRef(null);
  const containerRef = useRef(null);
  const currentUser = useStore(state => state.currentUser);

  useEffect(() => {
    initializeCall();
    
    return () => {
      CallService.endCall();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (localVideoRef.current && CallService.getLocalStream()) {
      localVideoRef.current.srcObject = CallService.getLocalStream();
    }
  }, [isVideoEnabled]);

  const initializeCall = async () => {
    try {
      const roomUrl = await CallService.createRoom(match.id, callType);
      await CallService.joinRoom(roomUrl, currentUser?.name || 'User', callType === 'video');
      setIsConnecting(false);
    } catch (err) {
      setError('Failed to connect to call');
      setIsConnecting(false);
    }
  };

  const handleToggleVideo = async () => {
    const newState = await CallService.toggleVideo();
    setIsVideoEnabled(newState);
  };

  const handleToggleAudio = async () => {
    const newState = await CallService.toggleAudio();
    setIsAudioEnabled(newState);
  };

  const handleSwitchCamera = async () => {
    await CallService.switchCamera();
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleEndCall = async () => {
    await CallService.endCall();
    onEnd();
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={containerRef}
      style={styles.container}
    >
      <div style={styles.header}>
        <div style={styles.headerInfo}>
          <img 
            src={match?.photos?.[0] || 'https://randomuser.me/api/portraits/women/1.jpg'} 
            alt={match?.name || 'User'}
            style={styles.headerPhoto}
          />
          <div>
            <h3 style={styles.headerName}>{match?.name || 'User'}</h3>
            <p style={styles.headerStatus}>
              {isConnecting ? 'Connecting...' : formatDuration(callDuration)}
            </p>
          </div>
        </div>
        <button style={styles.fullscreenBtn} onClick={handleToggleFullscreen}>
          {isFullscreen ? <FaCompress size={18} /> : <FaExpand size={18} />}
        </button>
      </div>

      <div style={styles.videoContainer}>
        <div style={styles.remoteVideo}>
          {isConnecting ? (
            <div style={styles.connectingState}>
              <div style={styles.spinner}></div>
              <p style={styles.connectingText}>Connecting...</p>
            </div>
          ) : error ? (
            <div style={styles.errorState}>
              <p style={styles.errorText}>{error}</p>
              <button style={styles.endBtn} onClick={handleEndCall}>End Call</button>
            </div>
          ) : (
            <div style={styles.avatarContainer}>
              <div style={styles.avatar}>
                <span style={styles.avatarText}>{match?.name?.[0] || 'U'}</span>
              </div>
              <p style={styles.remoteName}>{match?.name || 'User'}</p>
              <p style={styles.callTimer}>{formatDuration(callDuration)}</p>
            </div>
          )}
        </div>

        {callType === 'video' && isVideoEnabled && (
          <div style={styles.localVideo}>
            <video 
              ref={localVideoRef} 
              autoPlay 
              muted 
              playsInline
              style={styles.localVideoStream}
            />
          </div>
        )}

        {callType === 'audio' && (
          <div style={styles.audioOnly}>
            <div style={styles.avatar}>
              <span style={styles.avatarText}>{match?.name?.[0] || 'U'}</span>
            </div>
            <p style={styles.remoteName}>{match?.name}</p>
            <p style={styles.callTimer}>{formatDuration(callDuration)}</p>
          </div>
        )}
      </div>

      <div style={styles.controls}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleAudio}
          style={{
            ...styles.controlBtn,
            ...(isAudioEnabled ? {} : styles.controlBtnOff)
          }}
        >
          {isAudioEnabled ? <FaMicrophone size={22} /> : <FaMicrophoneSlash size={22} />}
        </motion.button>

        {callType === 'video' && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleVideo}
            style={{
              ...styles.controlBtn,
              ...(isVideoEnabled ? {} : styles.controlBtnOff)
            }}
          >
            {isVideoEnabled ? <FaVideo size={22} /> : <FaVideoSlash size={22} />}
          </motion.button>
        )}

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleEndCall}
          style={styles.endCallBtn}
        >
          <FaPhoneSlash size={26} />
        </motion.button>

        {callType === 'video' && isVideoEnabled && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSwitchCamera}
            style={styles.controlBtn}
          >
            <FaSyncAlt size={22} />
          </motion.button>
        )}

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onEnd}
          style={styles.closeBtn}
        >
          <FaTimes size={22} />
        </motion.button>
      </div>
    </motion.div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: '#000',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: '16px',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  headerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerPhoto: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  headerName: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 600,
    margin: 0,
  },
  headerStatus: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    margin: 0,
  },
  fullscreenBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '50%',
    padding: '10px',
    color: '#fff',
    cursor: 'pointer',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1a1a1a',
  },
  connectingState: {
    textAlign: 'center',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255,255,255,0.1)',
    borderTopColor: '#FF6B9D',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px',
  },
  connectingText: {
    color: '#fff',
    fontSize: '16px',
  },
  errorState: {
    textAlign: 'center',
    padding: '20px',
  },
  errorText: {
    color: '#FF6B9D',
    fontSize: '16px',
    marginBottom: '16px',
  },
  endBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
    border: 'none',
    borderRadius: '25px',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
  avatarContainer: {
    textAlign: 'center',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  avatarText: {
    color: '#fff',
    fontSize: '48px',
    fontWeight: 'bold',
  },
  remoteName: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '8px',
  },
  callTimer: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '16px',
  },
  audioOnly: {
    textAlign: 'center',
  },
  localVideo: {
    position: 'absolute',
    top: '80px',
    right: '16px',
    width: '100px',
    height: '140px',
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#333',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  },
  localVideoStream: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scaleX(-1)',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '24px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
  },
  controlBtn: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnOff: {
    background: '#F44336',
  },
  endCallBtn: {
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
  closeBtn: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default CallScreen;
