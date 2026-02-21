import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaHeart, FaStar, FaUndo, FaSlidersH, FaBolt, FaCheck } from 'react-icons/fa';
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
  
  const containerRef = useRef(null);
  const navigate = useNavigate();

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
      setCurrentIndex(profileCountBefore);
    }
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
      handleSwipe('right');
    } else if (info.offset.x < -swipeThreshold) {
      handleSwipe('left');
    }
    setSwipeDirection(null);
  };

  if (!currentProfile || profiles.length === 0) {
    return (
      <div style={styles.emptyState}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={styles.emptyIcon}
        >
          <span>💕</span>
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
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo}>
          M<span style={styles.logoAccent}>u</span>se
        </h1>
        <button 
          style={styles.filterBtn} 
          onClick={() => setShowFilters(true)}
        >
          <FaSlidersH size={16} />
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
            {/* Profile Image */}
            <img 
              src={currentProfile.photos[0]} 
              alt={currentProfile.name}
              style={styles.cardImage}
            />
            
            {/* Gradient Overlay */}
            <div style={styles.cardGradient}></div>
            
            {/* Online Badge */}
            {currentProfile.online && (
              <div style={styles.onlineBadge}>
                <span style={styles.onlineDot}></span>
                Active now
              </div>
            )}
            
            {/* Card Content */}
            <div style={styles.cardContent}>
              <div style={styles.nameRow}>
                <h2 style={styles.cardName}>
                  {currentProfile.name}, {currentProfile.age}
                </h2>
                <span style={styles.verifyBadge}>✓</span>
              </div>
              <p style={styles.cardLocation}>
                📍 {currentProfile.distance} miles away • {currentProfile.lastActive}
              </p>

              {/* Interests */}
              <div style={styles.interests}>
                {currentProfile.interests.slice(0, 3).map((interest, i) => (
                  <span key={i} style={styles.interestTag}>{interest}</span>
                ))}
              </div>

              {/* Bio */}
              <p style={styles.bio}>{currentProfile.bio}</p>

              {/* View Details */}
              <button 
                style={styles.viewDetailsBtn}
                onClick={() => setShowProfileDetail(true)}
              >
                Tap to view full profile
              </button>
            </div>

            {/* Like Overlay */}
            <motion.div
              style={{
                ...styles.likeOverlay,
                opacity: swipeDirection === 'right' ? 0.9 : 0,
              }}
            >
              <span style={{...styles.likeText, color: 'var(--accent-success)'}}>LIKE</span>
            </motion.div>
            
            {/* Nope Overlay */}
            <motion.div
              style={{
                ...styles.nopeOverlay,
                opacity: swipeDirection === 'left' ? 0.9 : 0,
              }}
            >
              <span style={{...styles.nopeText, color: 'var(--accent-error)'}}>NOPE</span>
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
          <FaUndo size={20} />
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
          <FaStar size={20} />
        </motion.button>

        <motion.button
          style={{...styles.actionBtn, ...styles.boostBtn}}
          onClick={handleBoost}
          whileTap={{ scale: 0.9 }}
        >
          <FaBolt size={18} />
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
              <h2 style={styles.matchTitle}>It's a Match!</h2>
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
              <span style={styles.boostIcon}>⚡</span>
              <h2 style={styles.boostTitle}>Profile Boosted!</h2>
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
              <span style={styles.superLikeStar}>⭐</span>
              <h2 style={styles.superLikeTitle}>Super Like Sent!</h2>
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
    padding: 'var(--space-md)',
    background: 'var(--bg-dark)',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 'var(--space-md)',
    flexShrink: 0,
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'var(--text-2xl)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  logoAccent: {
    color: 'var(--primary)',
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
    padding: '10px 16px',
    background: 'var(--surface-glass)',
    border: '1px solid var(--surface-glass-border)',
    borderRadius: '20px',
    color: 'var(--accent-gold)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    cursor: 'pointer',
  },
  cardContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-sm)',
    position: 'relative',
    minHeight: 0,
  },
  card: {
    position: 'absolute',
    width: '100%',
    maxWidth: '360px',
    height: '85%',
    maxHeight: '520px',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    background: 'var(--surface)',
    boxShadow: 'var(--shadow-lg)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
    pointerEvents: 'none',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 'var(--space-lg)',
  },
  onlineBadge: {
    position: 'absolute',
    top: 'var(--space-md)',
    left: 'var(--space-md)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    fontSize: '12px',
    color: 'var(--accent-success)',
  },
  onlineDot: {
    width: '8px',
    height: '8px',
    background: 'var(--accent-success)',
    borderRadius: '50%',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
  },
  cardName: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 'var(--text-2xl)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  verifyBadge: {
    color: 'var(--accent-success)',
    fontSize: '16px',
  },
  cardLocation: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 'var(--text-sm)',
    marginTop: '4px',
  },
  interests: {
    display: 'flex',
    gap: 'var(--space-sm)',
    marginTop: 'var(--space-md)',
    flexWrap: 'wrap',
  },
  interestTag: {
    padding: '6px 12px',
    background: 'rgba(255, 77, 109, 0.2)',
    borderRadius: '15px',
    fontSize: '12px',
    color: 'var(--primary-light)',
  },
  bio: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 'var(--text-sm)',
    marginTop: 'var(--space-md)',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  viewDetailsBtn: {
    width: '100%',
    marginTop: 'var(--space-md)',
    padding: '12px',
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    color: 'rgba(255,255,255,0.9)',
    fontSize: 'var(--text-sm)',
    cursor: 'pointer',
  },
  likeOverlay: {
    position: 'absolute',
    top: '40px',
    left: '20px',
    padding: '10px 20px',
    border: '3px solid var(--accent-success)',
    borderRadius: '8px',
    transform: 'rotate(-15deg)',
  },
  nopeOverlay: {
    position: 'absolute',
    top: '40px',
    right: '20px',
    padding: '10px 20px',
    border: '3px solid var(--accent-error)',
    borderRadius: '8px',
    transform: 'rotate(15deg)',
  },
  likeText: {
    fontSize: '32px',
    fontWeight: 700,
  },
  nopeText: {
    fontSize: '32px',
    fontWeight: 700,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 'var(--space-md)',
    padding: 'var(--space-lg) 0',
    flexShrink: 0,
  },
  actionBtn: {
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: 'var(--shadow-md)',
  },
  undoBtn: {
    width: '48px',
    height: '48px',
    background: 'var(--surface-glass)',
    color: 'var(--text-muted)',
    border: '1px solid var(--surface-glass-border)',
  },
  nopeBtn: {
    width: '68px',
    height: '68px',
    background: 'var(--surface-glass)',
    color: 'var(--accent-error)',
    border: '2px solid rgba(255, 71, 87, 0.3)',
  },
  superLikeBtn: {
    width: '52px',
    height: '52px',
    background: 'var(--surface-glass)',
    color: 'var(--accent-info)',
    border: '2px solid rgba(55, 66, 250, 0.3)',
  },
  boostBtn: {
    width: '52px',
    height: '52px',
    background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold))',
    color: '#fff',
    border: 'none',
  },
  likeBtn: {
    width: '68px',
    height: '68px',
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
    color: '#fff',
    boxShadow: '0 8px 30px rgba(255, 77, 109, 0.4)',
  },
  emptyState: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-xxl)',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: 'var(--space-lg)',
  },
  emptyTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 'var(--text-2xl)',
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-sm)',
  },
  emptyText: {
    color: 'var(--text-secondary)',
    fontSize: 'var(--text-base)',
    lineHeight: 1.6,
  },
  matchOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: 'var(--space-lg)',
  },
  matchCard: {
    width: '100%',
    maxWidth: '360px',
    background: 'linear-gradient(135deg, var(--primary), var(--accent-secondary))',
    borderRadius: 'var(--radius-xl)',
    padding: 'var(--space-xl)',
    textAlign: 'center',
  },
  matchHearts: {
    display: 'flex',
    justifyContent: 'center',
    gap: '5px',
    marginBottom: 'var(--space-lg)',
  },
  matchHeart: {
    fontSize: '24px',
  },
  matchTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 'var(--text-3xl)',
    fontWeight: 700,
    color: '#fff',
    marginBottom: 'var(--space-sm)',
  },
  matchText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 'var(--text-base)',
    marginBottom: 'var(--space-lg)',
  },
  matchPhotos: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 'var(--space-lg)',
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
    gap: 'var(--space-sm)',
  },
  sendMsgBtn: {
    width: '100%',
    padding: '16px',
    background: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--primary)',
    cursor: 'pointer',
  },
  keepSwipingBtn: {
    width: '100%',
    padding: '16px',
    background: 'transparent',
    border: '2px solid #fff',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
  },
  detailOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'flex-end',
  },
  detailSheet: {
    width: '100%',
    maxHeight: '90vh',
    background: 'var(--bg-dark)',
    borderTopLeftRadius: '30px',
    borderTopRightRadius: '30px',
    overflow: 'auto',
  },
  detailHandle: {
    width: '40px',
    height: '4px',
    background: 'var(--surface-glass-border)',
    borderRadius: '2px',
    margin: '12px auto',
  },
  detailPhotos: {
    display: 'flex',
    gap: 'var(--space-sm)',
    padding: '0 var(--space-md)',
    paddingBottom: 'var(--space-md)',
    overflowX: 'auto',
    paddingBottom: 'var(--space-md)',
  },
  detailPhoto: {
    width: '200px',
    height: '280px',
    borderRadius: 'var(--radius-lg)',
    objectFit: 'cover',
    flexShrink: 0,
  },
  detailContent: {
    padding: 'var(--space-md)',
    paddingBottom: 'var(--space-xxl)',
  },
  detailHeader: {
    marginBottom: 'var(--space-lg)',
  },
  detailSection: {
    marginBottom: 'var(--space-lg)',
  },
  detailInterests: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--space-sm)',
  },
  detailInterestTag: {
    padding: '8px 16px',
    background: 'rgba(255, 77, 109, 0.2)',
    borderRadius: '20px',
    fontSize: 'var(--text-sm)',
    color: 'var(--primary-light)',
  },
  promptAnswer: {
    background: 'var(--surface-glass)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    marginBottom: 'var(--space-sm)',
  },
  promptQuestion: {
    fontSize: 'var(--text-sm)',
    color: 'var(--primary-light)',
    marginBottom: '6px',
  },
  promptText: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-primary)',
  },
  superLikeOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(55, 66, 250, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: 'var(--space-lg)',
  },
  superLikeContent: {
    textAlign: 'center',
  },
  superLikeStar: {
    fontSize: '60px',
    display: 'block',
    marginBottom: 'var(--space-lg)',
  },
  superLikeTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 'var(--text-3xl)',
    fontWeight: 700,
    color: '#fff',
    marginBottom: 'var(--space-sm)',
  },
  superLikeText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 'var(--text-lg)',
  },
  boostOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(255, 215, 0, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: 'var(--space-lg)',
  },
  boostContent: {
    textAlign: 'center',
  },
  boostIcon: {
    fontSize: '60px',
    display: 'block',
    marginBottom: 'var(--space-lg)',
  },
  boostTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 'var(--text-3xl)',
    fontWeight: 700,
    color: '#fff',
    marginBottom: 'var(--space-sm)',
  },
  boostText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 'var(--text-lg)',
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    marginTop: 'var(--space-sm)',
  },
  filterInput: {
    width: '80px',
    padding: '12px',
    background: 'var(--surface-glass)',
    border: '1px solid var(--surface-glass-border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-base)',
    color: 'var(--text-primary)',
    textAlign: 'center',
  },
  filterSpan: {
    color: 'var(--text-muted)',
    fontSize: 'var(--text-sm)',
  },
  filterRange: {
    width: '100%',
    marginTop: 'var(--space-sm)',
    accentColor: 'var(--primary)',
  },
  filterGenderRow: {
    display: 'flex',
    gap: 'var(--space-sm)',
    marginTop: 'var(--space-sm)',
  },
  filterGenderBtn: {
    flex: 1,
    padding: '12px',
    background: 'var(--surface-glass)',
    border: '1px solid var(--surface-glass-border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  filterGenderBtnActive: {
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
    borderColor: 'transparent',
    color: '#fff',
  },
  editActions: {
    display: 'flex',
    gap: 'var(--space-sm)',
    marginTop: 'var(--space-lg)',
    paddingBottom: 'var(--space-lg)',
  },
  cancelEditBtn: {
    flex: 1,
    padding: '14px',
    background: 'var(--surface-glass)',
    border: '1px solid var(--surface-glass-border)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  saveEditBtn: {
    flex: 1,
    padding: '14px',
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-xs)',
  },
};
