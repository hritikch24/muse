import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaCog, FaShieldAlt, FaQuestionCircle, FaInfoCircle, FaHeart, FaStar, FaCamera, FaCheck, FaPowerOff, FaChevronRight, FaTimes, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
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
    setEditName(currentUser?.name || '');
    setEditAge(currentUser?.age?.toString() || '');
    setEditBio(currentUser?.bio || '');
    setEditLocation(currentUser?.location || '');
    setEditInterests(currentUser?.interests || []);
    setEditPrompts(currentUser?.prompts || []);
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

  const changePromptQuestion = (index, newQuestion) => {
    const newPrompts = [...editPrompts];
    newPrompts[index].question = newQuestion;
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
        <div style={styles.photoSection}>
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
          {currentUser?.online && (
            <div style={styles.onlineIndicator}></div>
          )}
        </div>
        <div style={styles.photoCount}>
          <span>{userPhotos.length} photos</span>
        </div>

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
              <stat.icon size={18} style={{ color: '#FF6B9D' }} />
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
        <h3 style={styles.sectionTitle}>Answers</h3>
        <div style={styles.promptsList}>
          {userPrompts.map((prompt, index) => (
            <div key={index} style={styles.promptCard}>
              <p style={styles.promptQuestion}>{prompt.question}</p>
              <p style={styles.promptAnswer}>{prompt.answer}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Settings - Converted to Bottom Sheet */}
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
              <FaChevronRight size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
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
                        onChange={(e) => changePromptQuestion(index, e.target.value)}
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
    padding: '20px',
    overflowY: 'auto',
    paddingBottom: '100px',
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
  editBtn: {
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
  profileCard: {
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '24px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  photoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  mainPhotoWrapper: {
    position: 'relative',
    width: '120px',
    height: '120px',
  },
  photoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginBottom: '16px',
  },
  photoItem: {
    position: 'relative',
    aspectRatio: '1',
    borderRadius: '12px',
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
    borderRadius: '50%',
    background: 'rgba(244,67,54,0.9)',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  emptyPhotoSlot: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.08)',
    border: '2px dashed rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.4)',
  },
  addPhotoSlot: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '12px',
    background: 'rgba(233,30,99,0.15)',
    border: '2px dashed rgba(233,30,99,0.4)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    color: '#FF6B9D',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #FF6B9D',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
    border: '3px solid #1A1A2E',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: '#4CAF50',
    border: '3px solid #1A1A2E',
  },
  photoCount: {
    marginTop: '8px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
  },
  profileInfo: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  profileName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '24px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '4px',
  },
  profileLocation: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '8px',
  },
  profileBio: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.5,
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#fff',
  },
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
  },
  premiumCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    background: 'linear-gradient(135deg, rgba(233,30,99,0.2), rgba(156,39,176,0.2))',
    borderRadius: '16px',
    border: '1px solid rgba(233,30,99,0.3)',
    marginBottom: '16px',
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
  premiumBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '12px',
  },
  interestsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  interestTag: {
    padding: '8px 16px',
    background: 'rgba(233,30,99,0.15)',
    borderRadius: '20px',
    fontSize: '14px',
    color: '#FF6B9D',
  },
  promptsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  promptCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  promptQuestion: {
    fontSize: '13px',
    color: '#FF6B9D',
    marginBottom: '6px',
  },
  promptAnswer: {
    fontSize: '15px',
    color: '#fff',
  },
  settingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  settingIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.8)',
  },
  settingInfo: {
    flex: 1,
    textAlign: 'left',
  },
  settingLabel: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#fff',
  },
  settingDesc: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
  },
  logoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '16px',
    background: 'rgba(244,67,54,0.15)',
    border: '1px solid rgba(244,67,54,0.3)',
    borderRadius: '12px',
    color: '#F44336',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    marginBottom: '20px',
  },
  version: {
    textAlign: 'center',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.3)',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: '20px',
  },
  premiumModal: {
    width: '100%',
    maxWidth: '360px',
    background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
    borderRadius: '24px',
    padding: '30px',
    position: 'relative',
    border: '1px solid rgba(233,30,99,0.3)',
  },
  modalClose: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  modalTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    fontWeight: 600,
    color: '#fff',
    textAlign: 'center',
    marginBottom: '8px',
  },
  modalSubtitle: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: '24px',
  },
  plansList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  planCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  planInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  planName: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
  },
  planDuration: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
  },
  planPrice: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#FF6B9D',
  },
  editModal: {
    width: '90%',
    maxWidth: '400px',
    background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
    borderRadius: '24px',
    padding: '24px',
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  editModalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  editModalTitle: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#fff',
    margin: 0,
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  editField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '16px',
  },
  editLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.7)',
  },
  interestsEditGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  },
  interestChip: {
    padding: '8px 14px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
  interestChipActive: {
    background: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
    borderColor: 'transparent',
    color: '#fff',
  },
  interestsHint: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '8px',
  },
  promptEditCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '10px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  promptSelect: {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#FF6B9D',
    outline: 'none',
    marginBottom: '8px',
    cursor: 'pointer',
  },
  promptInput: {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#fff',
    outline: 'none',
  },
  editInput: {
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    fontSize: '16px',
    color: '#fff',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  editTextarea: {
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    fontSize: '16px',
    color: '#fff',
    outline: 'none',
    resize: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
  },
  editActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
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
  },
  settingsModal: {
    width: '90%',
    maxWidth: '400px',
    background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
    borderRadius: '24px',
    padding: '24px',
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.1)',
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
    background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    padding: '20px',
    paddingBottom: '40px',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  bottomSheetHandle: {
    width: '40px',
    height: '4px',
    background: 'rgba(255,255,255,0.3)',
    borderRadius: '2px',
    margin: '0 auto 16px',
  },
  bottomSheetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  bottomSheetTitle: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#fff',
    margin: 0,
  },
  bottomSheetContent: {
    paddingBottom: '20px',
  },
  settingsModalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  settingsModalTitle: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#fff',
    margin: 0,
  },
  settingsModalContent: {
    padding: '10px 0',
  },
  settingsModalText: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.6,
    whiteSpace: 'pre-line',
  },
};
