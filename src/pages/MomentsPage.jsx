import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaHeart, FaComment, FaShare, FaPlay, FaPause, FaTimes, FaEye } from 'react-icons/fa';
import useStore from '../store/useStore';
import '../styles/globals.css';

const sampleMoments = [
  { id: 1, userName: 'Sarah', userPhoto: 'https://picsum.photos/seed/sarah/200/200', image: 'https://picsum.photos/seed/m1/400/700', views: 234, time: '2h ago', liked: false },
  { id: 2, userName: 'Emma', userPhoto: 'https://picsum.photos/seed/emma/200/200', image: 'https://picsum.photos/seed/m2/400/700', views: 156, time: '4h ago', liked: false },
  { id: 3, userName: 'Olivia', userPhoto: 'https://picsum.photos/seed/olivia/200/200', image: 'https://picsum.photos/seed/m3/400/700', views: 89, time: '6h ago', liked: false },
  { id: 4, userName: 'Ava', userPhoto: 'https://picsum.photos/seed/ava/200/200', image: 'https://picsum.photos/seed/m4/400/700', views: 312, time: '8h ago', liked: false },
  { id: 5, userName: 'Sophia', userPhoto: 'https://picsum.photos/seed/sophia/200/200', image: 'https://picsum.photos/seed/m5/400/700', views: 178, time: '12h ago', liked: false },
];

export default function MomentsPage() {
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [newCaption, setNewCaption] = useState('');
  const [momentLiked, setMomentLiked] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const currentUser = useStore(state => state.currentUser);
  const addMoment = useStore(state => state.addMoment);
  const moments = useStore(state => state.moments);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allMoments = Array.isArray(moments) ? [...moments, ...sampleMoments] : sampleMoments;

  useEffect(() => {
    if (selectedMoment && !isPaused) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            // Move to next moment
            const currentIndex = allMoments.findIndex(m => m.id === selectedMoment.id);
            if (currentIndex < allMoments.length - 1) {
              setSelectedMoment(allMoments[currentIndex + 1]);
              return 0;
            } else {
              setSelectedMoment(null);
              return 0;
            }
          }
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [selectedMoment, isPaused, allMoments]);

  const handleAddMoment = () => {
    if (currentUser?.photos?.[0]) {
      addMoment({
        image: currentUser.photos[0],
        caption: newCaption || 'My moment!'
      });
      setNewCaption('');
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addMoment({
          image: event.target.result,
          caption: newCaption || 'My moment!'
        });
        setNewCaption('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLikeMoment = (momentId) => {
    setMomentLiked(prev => ({
      ...prev,
      [momentId]: !prev[momentId]
    }));
  };

  // eslint-disable-next-line no-unused-vars
  const handleShareMoment = (moment) => {
    setShowShareModal(true);
    setTimeout(() => setShowShareModal(false), 2000);
  };

  const handleCommentMoment = (momentId) => {
    console.log('Comment on moment:', momentId);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Moments</h1>
        <button style={styles.addBtn} onClick={() => document.getElementById('moment-photo-input')?.click()}>
          <FaPlus size={18} />
        </button>
        <input
          type="file"
          id="moment-photo-input"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handlePhotoSelect}
        />
      </div>

      {/* My Story */}
      <div style={styles.myStorySection}>
        <div style={styles.myStory} onClick={() => document.getElementById('moment-photo-input')?.click()}>
          <div style={styles.myStoryRing}>
            <img 
              src={currentUser?.photos?.[0] || 'https://picsum.photos/seed/me/200/200'} 
              alt="" 
              style={styles.myStoryPhoto} 
            />
            <div style={styles.plusIcon}>
              <FaPlus size={12} />
            </div>
          </div>
          <p style={styles.myStoryLabel}>My Story</p>
        </div>

        {/* Other Stories */}
        <div style={styles.storiesList}>
          {moments && moments.length > 0 && moments.slice(0, 3).map((moment, index) => (
            <motion.div
              key={`my-${moment.id}`}
              style={styles.storyItem}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedMoment({ ...moment, userPhoto: currentUser?.photos?.[0], userName: 'You', time: 'Just now' });
                setProgress(0);
              }}
            >
              <div style={styles.storyRing}>
                <img src={currentUser?.photos?.[0] || 'https://picsum.photos/seed/me/200/200'} alt="" style={styles.storyPhoto} />
              </div>
              <p style={styles.storyName}>You</p>
            </motion.div>
          ))}
          {sampleMoments.map((moment, index) => (
            <motion.div
              key={moment.id}
              style={styles.storyItem}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedMoment(moment);
                setProgress(0);
              }}
            >
              <div style={styles.storyRing}>
                <img src={moment.userPhoto} alt="" style={styles.storyPhoto} />
              </div>
              <p style={styles.storyName}>{moment.userName}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Moments Feed */}
      <div style={styles.feedSection}>
        <h2 style={styles.feedTitle}>Recent Moments</h2>
        
        <div style={styles.feedGrid}>
          {sampleMoments.map((moment, index) => (
            <motion.div
              key={moment.id}
              style={styles.momentCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedMoment(moment);
                setProgress(0);
              }}
            >
              <img src={moment.image} alt="" style={styles.momentImage} />
              <div style={styles.momentOverlay}>
                <div style={styles.momentUser}>
                  <img src={moment.userPhoto} alt="" style={styles.momentUserPhoto} />
                  <span style={styles.momentUserName}>{moment.userName}</span>
                </div>
                <div style={styles.momentStats}>
                  <FaEye size={12} />
                  <span>{moment.views}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story Viewer */}
      <AnimatePresence>
        {selectedMoment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.storyViewer}
          >
            {/* Progress Bars */}
            <div style={styles.progressContainer}>
              {sampleMoments.map((m) => (
                <div key={m.id} style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: m.id === selectedMoment.id ? `${progress}%` : m.id < selectedMoment.id ? '100%' : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div style={styles.storyHeader}>
              <div style={styles.storyUser}>
                <img 
                  src={selectedMoment.userPhoto} 
                  alt="" 
                  style={styles.storyHeaderPhoto} 
                />
                <span style={styles.storyHeaderName}>{selectedMoment.userName}</span>
                <span style={styles.storyTime}>{selectedMoment.time}</span>
              </div>
              <button 
                style={styles.closeBtn}
                onClick={() => setSelectedMoment(null)}
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Story Image */}
            <img 
              src={selectedMoment.image} 
              alt="" 
              style={styles.storyFullImage}
              onClick={() => setIsPaused(!isPaused)}
            />

            {/* Story Actions */}
            <div style={styles.storyActions}>
              <button style={styles.storyActionBtn} onClick={() => handleLikeMoment(selectedMoment.id)}>
                <FaHeart size={24} />
              </button>
              <button style={styles.storyActionBtn} onClick={() => handleCommentMoment(selectedMoment.id)}>
                <FaComment size={24} />
              </button>
              <button style={styles.storyActionBtn} onClick={() => handleShareMoment(selectedMoment)}>
                <FaShare size={24} />
              </button>
            </div>

            {/* Pause indicator */}
            <AnimatePresence>
              {isPaused && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={styles.pauseOverlay}
                >
                  <FaPlay size={40} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: {
    height: '100%',
    padding: '20px',
    overflowY: 'auto',
    background: 'linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-dark) 100%)',
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
  addBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  myStorySection: {
    display: 'flex',
    gap: '16px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '20px',
    overflowX: 'auto',
  },
  myStory: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    minWidth: '70px',
  },
  myStoryRing: {
    position: 'relative',
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    padding: '3px',
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
  },
  myStoryPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid var(--surface)',
  },
  plusIcon: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: 'var(--primary)',
    border: '2px solid var(--surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  myStoryLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.8)',
  },
  storiesList: {
    display: 'flex',
    gap: '16px',
  },
  storyItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    minWidth: '60px',
    cursor: 'pointer',
  },
  storyRing: {
    width: '66px',
    height: '66px',
    borderRadius: '50%',
    padding: '3px',
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
  },
  storyPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid var(--surface)',
  },
  storyName: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.8)',
    maxWidth: '70px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  feedSection: {
    marginTop: '10px',
  },
  feedTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '16px',
  },
  feedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  momentCard: {
    position: 'relative',
    aspectRatio: '3/4',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  momentImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  momentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '12px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  momentUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  momentUserPhoto: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  momentUserName: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#fff',
  },
  momentStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)',
  },
  storyViewer: {
    position: 'fixed',
    inset: 0,
    background: '#000',
    zIndex: 200,
    display: 'flex',
    flexDirection: 'column',
  },
  progressContainer: {
    display: 'flex',
    gap: '6px',
    padding: '16px 12px',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  progressBar: {
    flex: 1,
    height: '3px',
    background: 'rgba(255,255,255,0.3)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#fff',
    transition: 'width 0.1s linear',
  },
  storyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    position: 'absolute',
    top: '30px',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  storyUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  storyHeaderPhoto: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  storyHeaderName: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#fff',
  },
  storyTime: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
  },
  closeBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  storyFullImage: {
    flex: 1,
    width: '100%',
    objectFit: 'contain',
  },
  storyActions: {
    position: 'absolute',
    bottom: '40px',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    padding: '0 20px',
  },
  storyActionBtn: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  pauseOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.3)',
    color: '#fff',
  },
};
