import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaCog, FaShieldAlt, FaQuestionCircle, FaInfoCircle, FaHeart, FaStar, FaCamera, FaCheck, FaPowerOff, FaChevronRight, FaTimes } from 'react-icons/fa';
import useStore from '../store/useStore';
import '../styles/globals.css';

const ALL_INTERESTS = [
  'Travel', 'Music', 'Food', 'Fitness', 'Reading', 'Movies',
  'Art', 'Cooking', 'Photography', 'Yoga', 'Gaming', 'Dancing',
  'Hiking', 'Wine', 'Coffee', 'Fashion', 'Nature', 'Tech'
];

const PROMPT_QUESTIONS = [
  'My simple pleasure',
  'My type?',
  'A fact about me',
  'Ideal first date',
  'I\'m overly competitive about',
  'My go-to karaoke song'
];

export default function ProfilePage() {
  const fileInputRef = useRef(null);
  const [showEditPhoto, setShowEditPhoto] = useState(false);
  const [photoInputKey, setPhotoInputKey] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editInterests, setEditInterests] = useState([]);
  const [editPrompts, setEditPrompts] = useState([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsModalContent, setSettingsModalContent] = useState(null);
  
  const currentUser = useStore(state => state.currentUser);
  const logout = useStore(state => state.logout);
  const matchedProfiles = useStore(state => state.matchedProfiles);
  const updateUserPhoto = useStore(state => state.updateUserPhoto);
  const premiumPlan = useStore(state => state.premiumPlan);
  const premiumPlans = useStore(state => state.premiumPlans);
  const purchasePremium = useStore(state => state.purchasePremium);
  const userLocation = useStore(state => state.userLocation);
  const fetchLocation = useStore(state => state.fetchLocation);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditAge(currentUser.age?.toString() || '');
      setEditBio(currentUser.bio || '');
      setEditLocation(currentUser.location || '');
      setEditInterests(currentUser.interests || []);
      setEditPrompts(currentUser.prompts || PROMPT_QUESTIONS.slice(0, 3).map(q => ({ question: q, answer: '' })));
    }
  }, [currentUser]);

  const handleEditClick = () => {
    setEditName(currentUser?.name || '');
    setEditAge(currentUser?.age?.toString() || '');
    setEditBio(currentUser?.bio || '');
    setEditLocation(currentUser?.location || '');
    setEditInterests(currentUser?.interests || []);
    setEditPrompts(currentUser?.prompts || PROMPT_QUESTIONS.slice(0, 3).map(q => ({ question: q, answer: '' })));
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const updatedUser = {
      ...currentUser,
      name: editName || currentUser?.name,
      age: parseInt(editAge) || currentUser?.age,
      bio: editBio || currentUser?.bio,
      location: editLocation || currentUser?.location,
      interests: editInterests,
      prompts: editPrompts
    };
    useStore.setState({ currentUser: updatedUser });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const toggleInterest = (interest) => {
    if (editInterests.includes(interest)) {
      setEditInterests(editInterests.filter(i => i !== interest));
    } else if (editInterests.length < 5) {
      setEditInterests([...editInterests, interest]);
    }
  };

  const updatePromptAnswer = (index, answer) => {
    const newPrompts = [...editPrompts];
    newPrompts[index].answer = answer;
    setEditPrompts(newPrompts);
  };

  const userPhotos = currentUser?.photos || [];
  const userName = currentUser?.name || 'User';
  const userAge = currentUser?.age || 25;
  const userBio = currentUser?.bio || 'Looking for something real';
  const userLocation2 = userLocation?.city || currentUser?.location || 'Your Location';
  const userInterests = currentUser?.interests || ['Music', 'Travel', 'Food'];
  const userPrompts = currentUser?.prompts || [
    { question: 'My simple pleasure', answer: 'Coffee and good conversations' },
    { question: 'My type?', answer: 'Someone genuine and kind' }
  ];

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateUserPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
    setPhotoInputKey(prev => prev + 1);
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = (index) => {
    const updatedPhotos = userPhotos.filter((_, i) => i !== index);
    useStore.setState({
      currentUser: currentUser ? { ...currentUser, photos: updatedPhotos } : null
    });
  };

  const handlePurchasePlan = (planId) => {
    purchasePremium(planId);
    setShowPremiumModal(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    { icon: FaHeart, value: matchedProfiles.length, label: 'Matches' },
    { icon: FaStar, value: 12, label: 'Likes' },
  ];

  const settings = [
    { icon: FaCog, label: 'Settings', description: 'App preferences', action: 'settings' },
    { icon: FaShieldAlt, label: 'Safety', description: 'Privacy & security', action: 'safety' },
    { icon: FaQuestionCircle, label: 'Help', description: 'Support center', action: 'help' },
    { icon: FaInfoCircle, label: 'About', description: 'Terms & privacy', action: 'about' },
  ];

  const handleSettingClick = (action) => {
    const contentMap = {
      settings: { title: 'Settings', content: 'App preferences and configuration options would appear here.' },
      safety: { title: 'Safety', content: 'Privacy settings, block list, and security options.' },
      help: { title: 'Help & Support', content: 'FAQ, contact support, and troubleshooting guides.' },
      about: { title: 'About Muse', content: 'Version 1.0.0\n\nTerms of Service\nPrivacy Policy' },
    };
    setSettingsModalContent(contentMap[action] || { title: 'Coming Soon', content: 'This feature is coming soon!' });
    setShowSettingsModal(true);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Profile</h1>
        <button style={styles.editBtn} onClick={handleEditClick}>
          <FaEdit size={16} />
        </button>
      </div>

      {/* Profile Card */}
      <motion.div 
        style={styles.profileCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <input
          type="file"
          ref={fileInputRef}
          id="profile-photo-input"
          key={photoInputKey}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handlePhotoUpload}
        />
        
        {/* Photo Grid */}
        <div style={styles.photoGrid}>
          {userPhotos.length > 0 ? (
            userPhotos.map((photo, index) => (
              <div key={index} style={styles.photoItem}>
                <img src={photo} alt="" style={styles.gridPhoto} />
                {index > 0 && (
                  <button 
                    style={styles.removePhotoBtn}
                    onClick={() => handleRemovePhoto(index)}
                  >
                    <FaTimes size={12} />
                  </button>
                )}
                {index === 0 && <div style={styles.primaryBadge}>Primary</div>}
              </div>
            ))
          ) : (
            <div style={styles.emptyPhotoSlot}>
              <FaCamera size={24} />
            </div>
          )}
          {userPhotos.length < 6 && (
            <div style={styles.addPhotoSlot} onClick={handleAddPhotoClick}>
              <FaCamera size={24} />
              <span>Add</span>
            </div>
          )}
        </div>
        
        <button 
          style={styles.cameraBtn}
          onClick={handleAddPhotoClick}
        >
          <FaCamera size={16} />
        </button>
        
        <div style={styles.photoCount}>
          <span>{userPhotos.length} photos</span>
        </div>

        {/* Profile Info */}
        <div style={styles.profileInfo}>
          <h2 style={styles.profileName}>
            {userName}, {userAge}
          </h2>
          <p style={styles.profileLocation}>📍 {userLocation2}</p>
          <p style={styles.profileBio}>{userBio}</p>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          {stats.map((stat, index) => (
            <div key={index} style={styles.statItem}>
              <stat.icon size={18} style={{ color: 'var(--primary)' }} />
              <span style={styles.statValue}>{stat.value}</span>
              <span style={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Premium Card */}
      <motion.div 
        style={styles.premiumCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={() => setShowPremiumModal(true)}
      >
        <div style={styles.premiumContent}>
          <span style={styles.premiumIcon}>✨</span>
          <div>
            <p style={styles.premiumTitle}>{premiumPlan ? 'Premium Active' : 'Muse Premium'}</p>
            <p style={styles.premiumText}>{premiumPlan ? `Valid until ${new Date(premiumPlan).toLocaleDateString()}` : 'Get unlimited likes & more'}</p>
          </div>
        </div>
        <button style={styles.premiumBtn}>{premiumPlan ? 'Manage' : 'Upgrade'}</button>
      </motion.div>

      {/* Interests */}
      <motion.div 
        style={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 style={styles.sectionTitle}>Interests</h3>
        <div style={styles.interestsGrid}>
          {userInterests.map((interest, index) => (
            <span key={index} style={styles.interestTag}>{interest}</span>
          ))}
        </div>
      </motion.div>

      {/* Prompts */}
      <motion.div 
        style={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 style={styles.sectionTitle}>About</h3>
        <div style={styles.promptsList}>
          {userPrompts.map((prompt, index) => (
            <div key={index} style={styles.promptCard}>
              <p style={styles.promptQuestion}>{prompt.question}</p>
              <p style={styles.promptAnswer}>{prompt.answer}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div 
        style={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 style={styles.sectionTitle}>Settings</h3>
        <div style={styles.settingsList}>
          {settings.map((setting, index) => (
            <button key={index} style={styles.settingItem} onClick={() => handleSettingClick(setting.action)}>
              <div style={styles.settingIcon}>
                <setting.icon size={18} />
              </div>
              <div style={styles.settingInfo}>
                <p style={styles.settingLabel}>{setting.label}</p>
                <p style={styles.settingDesc}>{setting.description}</p>
              </div>
              <FaChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Logout */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <FaPowerOff size={16} />
          Log Out
        </button>
      </motion.div>

      {/* Settings Modal - Bottom Sheet */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.bottomSheetOverlay}
            onClick={() => setShowSettingsModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={styles.bottomSheet}
              onClick={e => e.stopPropagation()}
            >
              <div style={styles.bottomSheetHandle}></div>
              <div style={styles.bottomSheetHeader}>
                <h2 style={styles.bottomSheetTitle}>{settingsModalContent?.title}</h2>
                <button style={styles.modalClose} onClick={() => setShowSettingsModal(false)}>
                  <FaTimes size={20} />
                </button>
              </div>
              <div style={styles.bottomSheetContent}>
                <p style={styles.settingsModalText}>{settingsModalContent?.content}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
            onClick={() => setShowPremiumModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={styles.premiumModal}
              onClick={e => e.stopPropagation()}
            >
              <button style={styles.modalClose} onClick={() => setShowPremiumModal(false)}>
                <FaTimes size={20} />
              </button>
              <h2 style={styles.modalTitle}>✨ Muse Premium</h2>
              <p style={styles.modalSubtitle}>Unlock unlimited features</p>
              
              <div style={styles.plansList}>
                {premiumPlans.map((plan) => (
                  <div 
                    key={plan.id} 
                    style={styles.planCard}
                    onClick={() => handlePurchasePlan(plan.id)}
                  >
                    <div style={styles.planInfo}>
                      <span style={styles.planName}>{plan.name}</span>
                      <span style={styles.planDuration}>{plan.duration} days</span>
                    </div>
                    <span style={styles.planPrice}>₹{plan.price}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={styles.editModal}
              onClick={e => e.stopPropagation()}
            >
              <div style={styles.editModalHeader}>
                <h2 style={styles.editModalTitle}>Edit Profile</h2>
                <button style={styles.modalClose} onClick={handleCancelEdit}>
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div style={styles.editForm}>
                <div style={styles.editField}>
                  <label style={styles.editLabel}>Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={styles.editInput}
                    placeholder="Your name"
                  />
                </div>
                
                <div style={styles.editField}>
                  <label style={styles.editLabel}>Age</label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    style={styles.editInput}
                    placeholder="Your age"
                    min="18"
                    max="100"
                  />
                </div>
                
                <div style={styles.editField}>
                  <label style={styles.editLabel}>Bio</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    style={styles.editTextarea}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
                
                <div style={styles.editField}>
                  <label style={styles.editLabel}>Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    style={styles.editInput}
                    placeholder="Your location"
                  />
                </div>
                
                <div style={styles.editField}>
                  <label style={styles.editLabel}>Interests (select up to 5)</label>
                  <div style={styles.interestsEditGrid}>
                    {ALL_INTERESTS.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        style={{
                          ...styles.interestChip,
                          ...(editInterests.includes(interest) ? styles.interestChipActive : {}),
                        }}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                        {editInterests.includes(interest) && <FaCheck size={12} />}
                      </button>
                    ))}
                  </div>
                  <p style={styles.interestsHint}>{editInterests.length}/5 selected</p>
                </div>
                
                <div style={styles.editField}>
                  <label style={styles.editLabel}>Conversation Prompts</label>
                  {editPrompts.map((prompt, index) => (
                    <div key={index} style={styles.promptEditCard}>
                      <select
                        value={prompt.question}
                        onChange={(e) => {
                          const newPrompts = [...editPrompts];
                          newPrompts[index].question = e.target.value;
                          setEditPrompts(newPrompts);
                        }}
                        style={styles.promptSelect}
                      >
                        {PROMPT_QUESTIONS.map((q) => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={prompt.answer}
                        onChange={(e) => updatePromptAnswer(index, e.target.value)}
                        style={styles.promptInput}
                        placeholder="Write your answer..."
                      />
                    </div>
                  ))}
                </div>
                
                <div style={styles.editActions}>
                  <button style={styles.cancelEditBtn} onClick={handleCancelEdit}>
                    Cancel
                  </button>
                  <button style={styles.saveEditBtn} onClick={handleSaveEdit}>
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p style={styles.version}>Version 1.0.0</p>
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
  editBtn: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--surface-glass)',
    border: 'none',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  profileCard: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius-xl)',
    padding: 'var(--space-lg)',
    border: '1px solid var(--surface-glass-border)',
    marginBottom: 'var(--space-md)',
  },
  photoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-md)',
  },
  photoItem: {
    position: 'relative',
    aspectRatio: '1',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
  },
  gridPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '24px',
    height: '24px',
    borderRadius: 'var(--radius-full)',
    background: 'rgba(255, 71, 87, 0.9)',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  primaryBadge: {
    position: 'absolute',
    bottom: '8px',
    left: '8px',
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#fff',
  },
  emptyPhotoSlot: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: 'var(--radius-md)',
    background: 'var(--surface-glass)',
    border: '2px dashed var(--surface-glass-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
  },
  addPhotoSlot: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(255, 77, 109, 0.15)',
    border: '2px dashed rgba(255, 77, 109, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    color: 'var(--primary-light)',
    fontSize: '12px',
    cursor: 'pointer',
  },
  cameraBtn: {
    position: 'absolute',
    top: 'calc(80px + var(--space-lg))',
    right: 'calc(var(--space-lg) + 30px)',
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
    border: '3px solid var(--surface)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  photoCount: {
    marginTop: 'var(--space-sm)',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
  profileInfo: {
    textAlign: 'center',
    marginBottom: 'var(--space-md)',
  },
  profileName: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 'var(--text-2xl)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  profileLocation: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    marginBottom: 'var(--space-sm)',
  },
  profileBio: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'var(--space-xl)',
    paddingTop: 'var(--space-md)',
    borderTop: '1px solid var(--surface-glass-border)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statValue: {
    fontSize: 'var(--text-xl)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  statLabel: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
  },
  premiumCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-md)',
    background: 'linear-gradient(135deg, rgba(255, 77, 109, 0.15), rgba(156, 39, 176, 0.15))',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid rgba(255, 77, 109, 0.3)',
    marginBottom: 'var(--space-md)',
    cursor: 'pointer',
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
  premiumBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    color: '#fff',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    cursor: 'pointer',
  },
  section: {
    marginBottom: 'var(--space-md)',
  },
  sectionTitle: {
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-sm)',
  },
  interestsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--space-sm)',
  },
  interestTag: {
    padding: '8px 16px',
    background: 'rgba(255, 77, 109, 0.15)',
    borderRadius: '20px',
    fontSize: 'var(--text-sm)',
    color: 'var(--primary-light)',
  },
  promptsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  promptCard: {
    background: 'var(--surface-glass)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    border: '1px solid var(--surface-glass-border)',
  },
  promptQuestion: {
    fontSize: 'var(--text-xs)',
    color: 'var(--primary-light)',
    marginBottom: '6px',
  },
  promptAnswer: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-primary)',
  },
  settingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-md)',
    background: 'var(--surface-glass)',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
  },
  settingIcon: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--surface-elevated)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 'var(--text-base)',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  settingDesc: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
  },
  logoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-md)',
    background: 'rgba(255, 71, 87, 0.15)',
    border: '1px solid rgba(255, 71, 87, 0.3)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--accent-error)',
    fontSize: 'var(--text-base)',
    fontWeight: 500,
    cursor: 'pointer',
    marginBottom: 'var(--space-lg)',
  },
  version: {
    textAlign: 'center',
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    paddingBottom: 'var(--space-xl)',
  },
  bottomSheetOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 200,
  },
  bottomSheet: {
    width: '100%',
    maxWidth: '500px',
    background: 'var(--surface)',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    padding: 'var(--space-md)',
    paddingBottom: 'calc(var(--space-xl) + var(--safe-area-bottom))',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  bottomSheetHandle: {
    width: '40px',
    height: '4px',
    background: 'var(--surface-glass-border)',
    borderRadius: '2px',
    margin: '0 auto var(--space-md)',
  },
  bottomSheetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-md)',
  },
  bottomSheetTitle: {
    fontSize: 'var(--text-xl)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  bottomSheetContent: {
    paddingBottom: 'var(--space-md)',
  },
  settingsModalText: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    whiteSpace: 'pre-line',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: 'var(--space-md)',
  },
  premiumModal: {
    width: '100%',
    maxWidth: '360px',
    background: 'var(--surface)',
    borderRadius: 'var(--radius-xl)',
    padding: 'var(--space-lg)',
    position: 'relative',
    border: '1px solid rgba(255, 77, 109, 0.3)',
  },
  modalClose: {
    position: 'absolute',
    top: 'var(--space-md)',
    right: 'var(--space-md)',
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--surface-glass)',
    border: 'none',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  modalTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 'var(--text-2xl)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    textAlign: 'center',
    marginBottom: 'var(--space-xs)',
  },
  modalSubtitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    textAlign: 'center',
    marginBottom: 'var(--space-lg)',
  },
  plansList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  planCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--space-md)',
    background: 'var(--surface-glass)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--surface-glass-border)',
    cursor: 'pointer',
  },
  planInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  planName: {
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  planDuration: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
  },
  planPrice: {
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
    color: 'var(--primary)',
  },
  editModal: {
    width: '90%',
    maxWidth: '400px',
    background: 'var(--surface)',
    borderRadius: 'var(--radius-xl)',
    padding: 'var(--space-lg)',
    position: 'relative',
    border: '1px solid var(--surface-glass-border)',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  editModalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-md)',
  },
  editModalTitle: {
    fontSize: 'var(--text-xl)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  editField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  editLabel: {
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
  interestsEditGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--space-xs)',
    marginTop: 'var(--space-xs)',
  },
  interestChip: {
    padding: '8px 14px',
    borderRadius: '20px',
    border: '1px solid var(--surface-glass-border)',
    background: 'var(--surface-glass)',
    color: 'var(--text-secondary)',
    fontSize: 'var(--text-xs)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  interestChipActive: {
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
    borderColor: 'transparent',
    color: '#fff',
  },
  interestsHint: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    marginTop: 'var(--space-xs)',
  },
  promptEditCard: {
    background: 'var(--surface-glass)',
    borderRadius: 'var(--radius-sm)',
    padding: 'var(--space-sm)',
    marginBottom: 'var(--space-xs)',
  },
  promptSelect: {
    width: '100%',
    padding: '10px 12px',
    background: 'var(--surface-elevated)',
    border: '1px solid var(--surface-glass-border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    color: 'var(--primary-light)',
    outline: 'none',
    marginBottom: 'var(--space-xs)',
    cursor: 'pointer',
  },
  promptInput: {
    width: '100%',
    padding: '10px 12px',
    background: 'var(--surface-elevated)',
    border: '1px solid var(--surface-glass-border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  editInput: {
    padding: '14px 16px',
    background: 'var(--surface-glass)',
    border: '1px solid var(--surface-glass-border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-base)',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  editTextarea: {
    padding: '14px 16px',
    background: 'var(--surface-glass)',
    border: '1px solid var(--surface-glass-border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-base)',
    color: 'var(--text-primary)',
    outline: 'none',
    resize: 'none',
  },
  editActions: {
    display: 'flex',
    gap: 'var(--space-sm)',
    marginTop: 'var(--space-sm)',
  },
  cancelEditBtn: {
    flex: 1,
    padding: '14px',
    background: 'var(--surface-glass)',
    border: '1px solid var(--surface-glass-border)',
    borderRadius: 'var(--radius-sm)',
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
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
  },
};
