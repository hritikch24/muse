import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaHeart, FaStar, FaComment, FaUndo, FaSlidersH, FaBolt, FaCheck } from 'react-icons/fa';
import useStore from '../store/useStore';
import '../styles/globals.css';

export default function DiscoveryPage() {
  const profiles = useStore(state => state.profiles);
  const swipeRight = useStore(state => state.swipeRight);
  const swipeLeft = useStore(state => state.swipeLeft);
  const undoSwipe = useStore(state => state.undoSwipe);
  const passedProfiles = useStore(state => state.passedProfiles);
  const premiumPlan = useStore(state => state.premiumPlan);
  const preferences = useStore(state => state.preferences);
  const updatePreferences = useStore(state => state.updatePreferences);
  const boostProfile = useStore(state => state.boostProfile);
  const lastBoost = useStore(state => state.lastBoost);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchProfile, setMatchProfile] = useState(null);
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showBoostAnimation, setShowBoostAnimation] = useState(false);
  const [filterAgeMin, setFilterAgeMin] = useState(preferences.ageRange[0]);
  const [filterAgeMax, setFilterAgeMax] = useState(preferences.ageRange[1]);
  const [filterDistance, setFilterDistance] = useState(preferences.distance);
  const [filterGender, setFilterGender] = useState(preferences.gender);
  const [superLikedProfile, setSuperLikedProfile] = useState(null);
  const [showSuperLikeAnimation, setShowSuperLikeAnimation] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleDrag = (event, info) => {
    if (info.offset.x > 50) {
      setSwipeDirection('right');
    } else if (info.offset.x < -50) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      console.log('Swipe RIGHT - LIKE');
      handleSwipe('right');
    } else if (info.offset.x < -swipeThreshold) {
      console.log('Swipe LEFT - NOPE');
      handleSwipe('left');
    }
    setSwipeDirection(null);
  };

  const canBoost = () => {
    if (!lastBoost) return true;
    const hoursSinceBoost = (Date.now() - new Date(lastBoost).getTime()) / (1000 * 60 * 60);
    return hoursSinceBoost >= 24;
  };

  const handleBoost = () => {
    if (premiumPlan && canBoost()) {
      boostProfile();
      setShowBoostAnimation(true);
      setTimeout(() => setShowBoostAnimation(false), 3000);
    } else {
      navigate('/profile');
    }
  };

  const currentProfile = profiles[currentIndex];

  const handleSwipe = (direction) => {
    if (!currentProfile) return;

    if (direction === 'right') {
      swipeRight(currentProfile.id);
      // Check if it's a match (simulated)
      if (Math.random() > 0.6) {
        setMatchProfile(currentProfile);
        setShowMatch(true);
        setTimeout(() => setShowMatch(false), 3000);
      }
    } else if (direction === 'left') {
      swipeLeft(currentProfile.id);
    }

    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSuperLike = () => {
    if (!currentProfile) return;
    // Super like has higher match rate (80%)
    swipeRight(currentProfile.id);
    setSuperLikedProfile(currentProfile);
    setShowSuperLikeAnimation(true);
    setTimeout(() => setShowSuperLikeAnimation(false), 2000);
    if (Math.random() > 0.2) {
      setMatchProfile(currentProfile);
      setShowMatch(true);
      setTimeout(() => setShowMatch(false), 3000);
    }
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleUndo = () => {
    if (passedProfiles.length > 0) {
      const profileCountBefore = profiles.length;
      undoSwipe();
      // After undo, the restored profile is added to the end, so we set index to show it
      setCurrentIndex(profileCountBefore);
    }
  };

  if (!currentProfile || profiles.length === 0) {
    return (
      <div style={styles.emptyState}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={styles.emptyIcon}
        >
          <span style={{ fontSize: '60px' }}>✨</span>
        </motion.div>
        <h2 style={styles.emptyTitle}>That's everyone!</h2>
        <p style={styles.emptyText}>
          You've seen all available profiles. Check back later for new matches!
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container} ref={containerRef}>
      {/* Header with Filters */}
      <div style={styles.header}>
        <h1 style={styles.logo}>M<span style={styles.logoAccent}>u</span>se</h1>
        <button style={styles.filterBtn} onClick={() => setShowFilters(true)}>
          <FaSlidersH size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Card Stack */}
      <div style={styles.cardContainer}>
        <AnimatePresence>
            <motion.div
              key={currentProfile.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={styles.card}
          >
            <img 
              src={currentProfile.photos[0]} 
              alt={currentProfile.name}
              style={styles.cardImage}
            />
            
            {/* Card Overlay */}
            <div style={styles.cardOverlay}>
              <div style={styles.cardGradient}></div>
              
              {/* Online indicator */}
              {currentProfile.online && (
                <div style={styles.onlineBadge}>
                  <span style={styles.onlineDot}></span>
                  Active now
                </div>
              )}
              
              {/* Card Info */}
              <div style={styles.cardInfo}>
                <div style={styles.nameRow}>
                  <h2 style={styles.cardName}>
                    {currentProfile.name}, {currentProfile.age}
                  </h2>
                  <span style={styles.verifyBadge}>✓</span>
                </div>
                <p style={styles.cardLocation}>
                  📍 {currentProfile.distance} miles away • {currentProfile.lastActive}
                </p>
              </div>

              {/* Quick Stats */}
              <div style={styles.quickStats}>
                {currentProfile.interests.slice(0, 3).map((interest, i) => (
                  <span key={i} style={styles.interestTag}>{interest}</span>
                ))}
              </div>

              {/* Bio Preview */}
              <p style={styles.bioPreview}>{currentProfile.bio}</p>

              {/* View Details Button */}
              <button 
                style={styles.viewDetailsBtn}
                onClick={() => setShowProfileDetail(true)}
              >
                Tap to view full profile
              </button>
            </div>

            {/* Like/Nope Overlays */}
            <motion.div
              style={{
                ...styles.likeOverlay,
                opacity: swipeDirection === 'right' ? 0.9 : 0,
                borderColor: '#4CAF50',
                transform: 'rotate(-15deg)',
              }}
            >
              <span style={{...styles.likeText, color: '#4CAF50'}}>LIKE</span>
            </motion.div>
            
            <motion.div
              style={{
                ...styles.nopeOverlay,
                opacity: swipeDirection === 'left' ? 0.9 : 0,
                borderColor: '#F44336',
                transform: 'rotate(15deg)',
              }}
            >
              <span style={{...styles.nopeText, color: '#F44336'}}>NOPE</span>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div style={styles.actions}>
        <motion.button
          style={{...styles.actionBtn, ...styles.undoBtn}}
          onClick={handleUndo}
          disabled={passedProfiles.length === 0}
          whileTap={{ scale: 0.9 }}
        >
          <FaUndo size={22} />
        </motion.button>
        
        <motion.button
          style={{...styles.actionBtn, ...styles.nopeBtn}}
          onClick={() => handleSwipe('left')}
          whileTap={{ scale: 0.9 }}
        >
          <FaTimes size={26} />
        </motion.button>
        
        <motion.button
          style={{...styles.actionBtn, ...styles.superLikeBtn}}
          onClick={handleSuperLike}
          whileTap={{ scale: 0.9 }}
        >
          <FaStar size={22} />
        </motion.button>

        <motion.button
          style={{...styles.actionBtn, ...styles.boostBtn}}
          onClick={handleBoost}
          whileTap={{ scale: 0.9 }}
        >
          <FaBolt size={20} />
        </motion.button>
        
        <motion.button
          style={{...styles.actionBtn, ...styles.likeBtn}}
          onClick={() => handleSwipe('right')}
          whileTap={{ scale: 0.9 }}
        >
          <FaHeart size={24} />
        </motion.button>
      </div>

      {/* Match Modal */}
      <AnimatePresence>
        {showMatch && matchProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.matchOverlay}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              style={styles.matchCard}
            >
              <div style={styles.matchHearts}>
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    style={styles.matchHeart}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 1] }}
                    transition={{ delay: i * 0.1 }}
                  >
                    ❤️
                  </motion.span>
                ))}
              </div>
              <h2 style={styles.matchTitle}>It's a Match! 💕</h2>
              <p style={styles.matchText}>
                You and {matchProfile.name} liked each other
              </p>
              <div style={styles.matchPhotos}>
                <img 
                  src={matchProfile.photos[0]} 
                  alt="" 
                  style={styles.matchPhoto} 
                />
              </div>
              <div style={styles.matchActions}>
                <button 
                  style={styles.sendMsgBtn}
                  onClick={() => setShowMatch(false)}
                >
                  Send a Message
                </button>
                <button 
                  style={styles.keepSwipingBtn}
                  onClick={() => setShowMatch(false)}
                >
                  Keep Swiping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boost Animation */}
      <AnimatePresence>
        {showBoostAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.boostOverlay}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              style={styles.boostContent}
            >
              <motion.span
                style={styles.boostIcon}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                ⚡
              </motion.span>
              <h2 style={styles.boostTitle}>Profile Boosted! 🚀</h2>
              <p style={styles.boostText}>
                You're now at the top of their likes!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Super Like Animation */}
      <AnimatePresence>
        {showSuperLikeAnimation && superLikedProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.superLikeOverlay}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              style={styles.superLikeContent}
            >
              <motion.span
                style={styles.superLikeStar}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                ⭐
              </motion.span>
              <h2 style={styles.superLikeTitle}>Super Like Sent! ✨</h2>
              <p style={styles.superLikeText}>
                You super liked {superLikedProfile.name}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Detail Modal */}
      <AnimatePresence>
        {showProfileDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.detailOverlay}
            onClick={() => setShowProfileDetail(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              style={styles.detailSheet}
              onClick={e => e.stopPropagation()}
            >
              <div style={styles.detailHandle}></div>
              
              <div style={styles.detailPhotos}>
                {currentProfile.photos.map((photo, i) => (
                  <img 
                    key={i}
                    src={photo} 
                    alt="" 
                    style={styles.detailPhoto}
                  />
                ))}
              </div>
              
              <div style={styles.detailContent}>
                <div style={styles.detailHeader}>
                  <h2>{currentProfile.name}, {currentProfile.age}</h2>
                  <p>📍 {currentProfile.distance} miles away</p>
                </div>
                
                <div style={styles.detailSection}>
                  <h3>About</h3>
                  <p>{currentProfile.bio}</p>
                </div>
                
                <div style={styles.detailSection}>
                  <h3>Interests</h3>
                  <div style={styles.detailInterests}>
                    {currentProfile.interests.map((interest, i) => (
                      <span key={i} style={styles.detailInterestTag}>{interest}</span>
                    ))}
                  </div>
                </div>
                
                <div style={styles.detailSection}>
                  <h3>Answers</h3>
                  {currentProfile.prompts.map((prompt, i) => (
                    <div key={i} style={styles.promptAnswer}>
                      <p style={styles.promptQuestion}>{prompt.question}</p>
                      <p style={styles.promptText}>{prompt.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.detailOverlay}
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              style={styles.detailSheet}
              onClick={e => e.stopPropagation()}
            >
              <div style={styles.detailHandle}></div>
              
              <div style={styles.detailContent}>
                <div style={styles.detailHeader}>
                  <h2>Discovery Settings</h2>
                </div>
                
                <div style={styles.detailSection}>
                  <h3>Age Range</h3>
                  <div style={styles.filterRow}>
                    <input
                      type="number"
                      value={filterAgeMin}
                      onChange={(e) => setFilterAgeMin(parseInt(e.target.value))}
                      style={styles.filterInput}
                      min="18"
                      max="100"
                    />
                    <span style={styles.filterSpan}>to</span>
                    <input
                      type="number"
                      value={filterAgeMax}
                      onChange={(e) => setFilterAgeMax(parseInt(e.target.value))}
                      style={styles.filterInput}
                      min="18"
                      max="100"
                    />
                  </div>
                </div>
                
                <div style={styles.detailSection}>
                  <h3>Maximum Distance: {filterDistance} miles</h3>
                  <input
                    type="range"
                    value={filterDistance}
                    onChange={(e) => setFilterDistance(parseInt(e.target.value))}
                    style={styles.filterRange}
                    min="1"
                    max="100"
                  />
                </div>
                
                <div style={styles.detailSection}>
                  <h3>Show Me</h3>
                  <div style={styles.filterGenderRow}>
                    {['all', 'men', 'women'].map((gender) => (
                      <button
                        key={gender}
                        style={{
                          ...styles.filterGenderBtn,
                          ...(filterGender === gender ? styles.filterGenderBtnActive : {}),
                        }}
                        onClick={() => setFilterGender(gender)}
                      >
                        {gender === 'all' ? 'Everyone' : gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div style={styles.editActions}>
                  <button style={styles.cancelEditBtn} onClick={() => setShowFilters(false)}>
                    Cancel
                  </button>
                  <button style={styles.saveEditBtn} onClick={() => {
                    updatePreferences({
                      ageRange: [filterAgeMin, filterAgeMax],
                      distance: filterDistance,
                      gender: filterGender
                    });
                    setShowFilters(false);
                  }}>
                    <FaCheck size={14} /> Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
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
    padding: '16px',
    paddingBottom: '100px',
    background: 'linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    paddingTop: '8px',
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    fontWeight: 700,
    color: '#fff',
  },
  logoAccent: {
    color: '#FF6B9D',
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '20px',
    color: '#FFD700',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  cardContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: '92%',
    maxWidth: '360px',
    height: '78%',
    maxHeight: '540px',
    borderRadius: '20px',
    overflow: 'hidden',
    background: '#2A2A4A',
    boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 10px 30px rgba(233,30,99,0.15)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '20px',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '200px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
  },
  onlineBadge: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    fontSize: '12px',
    color: '#4CAF50',
  },
  onlineDot: {
    width: '8px',
    height: '8px',
    background: '#4CAF50',
    borderRadius: '50%',
  },
  cardInfo: {
    position: 'relative',
    zIndex: 1,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cardName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '26px',
    fontWeight: 600,
    color: '#fff',
  },
  verifyBadge: {
    color: '#4CAF50',
    fontSize: '18px',
  },
  cardLocation: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
    marginTop: '4px',
  },
  quickStats: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    flexWrap: 'wrap',
  },
  interestTag: {
    padding: '6px 12px',
    background: 'rgba(233,30,99,0.3)',
    borderRadius: '15px',
    fontSize: '12px',
    color: '#FF6B9D',
  },
  bioPreview: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '14px',
    marginTop: '12px',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  viewDetailsBtn: {
    width: '100%',
    marginTop: '16px',
    padding: '12px',
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.9)',
    fontSize: '14px',
    cursor: 'pointer',
  },
  likeOverlay: {
    position: 'absolute',
    top: '40px',
    left: '20px',
    padding: '10px 20px',
    border: '3px solid #4CAF50',
    borderRadius: '8px',
    transform: 'rotate(-15deg)',
  },
  nopeOverlay: {
    position: 'absolute',
    top: '40px',
    right: '20px',
    padding: '10px 20px',
    border: '3px solid #F44336',
    borderRadius: '8px',
  },
  likeText: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#4CAF50',
  },
  nopeText: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#F44336',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    padding: '20px 0',
  },
  actionBtn: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  undoBtn: {
    background: 'rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(255,255,255,0.2)',
    width: '48px',
    height: '48px',
  },
  nopeBtn: {
    width: '68px',
    height: '68px',
    background: 'rgba(255,255,255,0.12)',
    color: '#F44336',
    border: '2px solid rgba(244,67,54,0.4)',
  },
  superLikeBtn: {
    background: 'rgba(255,255,255,0.12)',
    color: '#2196F3',
    border: '2px solid rgba(33,150,243,0.4)',
    width: '52px',
    height: '52px',
  },
  boostBtn: {
    width: '52px',
    height: '52px',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 20px rgba(255,215,0,0.4)',
  },
  likeBtn: {
    width: '68px',
    height: '68px',
    background: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
    color: '#fff',
    boxShadow: '0 8px 30px rgba(233,30,99,0.5)',
  },
  emptyState: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    color: '#fff',
    marginBottom: '12px',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '16px',
    lineHeight: 1.6,
  },
  matchOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '20px',
  },
  matchCard: {
    width: '100%',
    maxWidth: '360px',
    background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
    borderRadius: '24px',
    padding: '40px',
    textAlign: 'center',
  },
  matchHearts: {
    display: 'flex',
    justifyContent: 'center',
    gap: '5px',
    marginBottom: '20px',
  },
  matchHeart: {
    fontSize: '24px',
  },
  matchTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '36px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '10px',
  },
  matchText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '16px',
    marginBottom: '30px',
  },
  matchPhotos: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  matchPhoto: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '4px solid #fff',
    objectFit: 'cover',
  },
  matchActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sendMsgBtn: {
    width: '100%',
    padding: '16px',
    background: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#E91E63',
    cursor: 'pointer',
  },
  keepSwipingBtn: {
    width: '100%',
    padding: '16px',
    background: 'transparent',
    border: '2px solid #fff',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
  },
  detailOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'flex-end',
  },
  detailSheet: {
    width: '100%',
    maxHeight: '90vh',
    background: '#1A1A2E',
    borderTopLeftRadius: '30px',
    borderTopRightRadius: '30px',
    overflow: 'auto',
  },
  detailHandle: {
    width: '40px',
    height: '4px',
    background: 'rgba(255,255,255,0.3)',
    borderRadius: '2px',
    margin: '12px auto',
  },
  detailPhotos: {
    display: 'flex',
    gap: '10px',
    padding: '0 20px',
    overflowX: 'auto',
    paddingBottom: '20px',
  },
  detailPhoto: {
    width: '200px',
    height: '280px',
    borderRadius: '16px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  detailContent: {
    padding: '20px',
  },
  detailHeader: {
    marginBottom: '24px',
  },
  detailSection: {
    marginBottom: '24px',
  },
  detailInterests: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  detailInterestTag: {
    padding: '8px 16px',
    background: 'rgba(233,30,99,0.2)',
    borderRadius: '20px',
    fontSize: '14px',
    color: '#FF6B9D',
  },
  promptAnswer: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
  },
  promptQuestion: {
    fontSize: '14px',
    color: '#FF6B9D',
    marginBottom: '6px',
  },
  promptText: {
    fontSize: '15px',
    color: '#fff',
  },
  superLikeOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(33,150,243,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '20px',
  },
  superLikeContent: {
    textAlign: 'center',
  },
  superLikeStar: {
    fontSize: '60px',
    display: 'block',
    marginBottom: '20px',
  },
  superLikeTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '32px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '10px',
  },
  superLikeText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '18px',
  },
  boostOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(255,215,0,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '20px',
  },
  boostContent: {
    textAlign: 'center',
  },
  boostIcon: {
    fontSize: '60px',
    display: 'block',
    marginBottom: '20px',
  },
  boostTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '32px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '10px',
  },
  boostText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '18px',
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '10px',
  },
  filterInput: {
    width: '80px',
    padding: '12px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    fontSize: '16px',
    color: '#fff',
    textAlign: 'center',
  },
  filterSpan: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
  },
  filterRange: {
    width: '100%',
    marginTop: '10px',
    accentColor: '#FF6B9D',
  },
  filterGenderRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  filterGenderBtn: {
    flex: 1,
    padding: '12px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
  },
  filterGenderBtnActive: {
    background: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
    borderColor: 'transparent',
    color: '#fff',
  },
  editActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    paddingBottom: '20px',
  },
  cancelEditBtn: {
    flex: 1,
    padding: '14px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
  },
  saveEditBtn: {
    flex: 1,
    padding: '14px',
    background: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
};
