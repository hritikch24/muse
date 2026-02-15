import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaHeart, FaUser, FaCheck } from 'react-icons/fa';
import useStore from '../store/useStore';
import '../styles/globals.css';

const STEPS = [
  { id: 'photos', title: 'Add Your Photos', subtitle: 'Show your best self' },
  { id: 'info', title: 'About You', subtitle: 'Tell us about yourself' },
  { id: 'interests', title: 'Your Interests', subtitle: 'What do you love?' },
  { id: 'prompts', title: 'Conversation Starters', subtitle: 'Let your personality shine' },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bio: '',
    photos: [],
    interests: [],
    prompts: [
      { question: 'My simple pleasure', answer: '' },
      { question: 'My type?', answer: '' },
      { question: 'A fact about me', answer: '' },
    ],
  });
  const navigate = useNavigate();
  const signup = useStore(state => state.signup);
  const photoInputRef = useRef(null);

  const interestsList = [
    'Travel', 'Music', 'Food', 'Fitness', 'Reading', 'Movies',
    'Art', 'Cooking', 'Photography', 'Yoga', 'Gaming', 'Dancing',
    'Hiking', 'Wine', 'Coffee', 'Fashion', 'Nature', 'Tech'
  ];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      signup({
        ...formData,
        location: 'Your Location',
        distance: 0,
        onboardingCompleted: true
      });
      navigate('/');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && formData.photos.length < 6) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, photos: [...formData.photos, event.target.result] });
      };
      reader.readAsDataURL(file);
    }
  };

  const addPhoto = () => {
    photoInputRef.current?.click();
  };

  const removePhoto = (index) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index)
    });
  };

  const toggleInterest = (interest) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter(i => i !== interest)
      });
    } else if (formData.interests.length < 5) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}>
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
      </div>

      <motion.div 
        style={styles.header}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 style={styles.logo}>M<span style={styles.logoAccent}>u</span>se</h1>
      </motion.div>

      <div style={styles.progressContainer}>
        {STEPS.map((step, index) => (
          <motion.div
            key={step.id}
            style={styles.progressStep}
            initial={false}
            animate={{
              background: index <= currentStep 
                ? 'linear-gradient(135deg, #E91E63, #FF6B9D)' 
                : 'rgba(255,255,255,0.1)',
              width: index <= currentStep ? '100%' : '100%',
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          style={styles.stepContainer}
        >
          <h2 style={styles.stepTitle}>{STEPS[currentStep].title}</h2>
          <p style={styles.stepSubtitle}>{STEPS[currentStep].subtitle}</p>

          {currentStep === 0 && (
            <div style={styles.photosGrid}>
              <input
                type="file"
                ref={photoInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
              {formData.photos.map((photo, index) => (
                <motion.div
                  key={index}
                  style={styles.photoCard}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <img src={photo} alt="" style={styles.photo} />
                  <button 
                    style={styles.removePhoto}
                    onClick={() => removePhoto(index)}
                  >
                    ×
                  </button>
                  {index === 0 && <div style={styles.primaryBadge}>Primary</div>}
                </motion.div>
              ))}
              {formData.photos.length < 6 && (
                <motion.button
                  style={styles.addPhotoBtn}
                  onClick={addPhoto}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaCamera size={24} />
                  <span>Add Photo</span>
                </motion.button>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div style={styles.formContainer}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={styles.input}
                  placeholder="Your name"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  style={styles.input}
                  placeholder="Your age"
                  min={18}
                  max={99}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  style={styles.textarea}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div style={styles.interestsGrid}>
              {interestsList.map((interest) => (
                <motion.button
                  key={interest}
                  style={{
                    ...styles.interestChip,
                    ...(formData.interests.includes(interest) ? styles.interestChipActive : {}),
                  }}
                  onClick={() => toggleInterest(interest)}
                  whileTap={{ scale: 0.95 }}
                >
                  {interest}
                  {formData.interests.includes(interest) && <FaCheck size={12} />}
                </motion.button>
              ))}
              <p style={styles.interestsHint}>
                Select up to 5 interests ({formData.interests.length}/5)
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div style={styles.promptsContainer}>
              {formData.prompts.map((prompt, index) => (
                <div key={index} style={styles.promptCard}>
                  <p style={styles.promptQuestion}>{prompt.question}</p>
                  <input
                    type="text"
                    value={prompt.answer}
                    onChange={(e) => {
                      const newPrompts = [...formData.prompts];
                      newPrompts[index].answer = e.target.value;
                      setFormData({...formData, prompts: newPrompts});
                    }}
                    style={styles.promptInput}
                    placeholder="Write your answer..."
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={styles.navigation}>
        <button 
          style={{...styles.navBtn, ...styles.navBtnBack}}
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </button>
        <button 
          style={{...styles.navBtn, ...styles.navBtnNext}}
          onClick={handleNext}
        >
          {currentStep === STEPS.length - 1 ? 'Get Started' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  shape1: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(233,30,99,0.3) 0%, transparent 70%)',
    top: '-200px',
    right: '-100px',
  },
  shape2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(156,39,176,0.3) 0%, transparent 70%)',
    bottom: '-100px',
    left: '-100px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    zIndex: 1,
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '48px',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-2px',
  },
  logoAccent: {
    color: '#FF6B9D',
  },
  progressContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '40px',
    zIndex: 1,
  },
  progressStep: {
    flex: 1,
    height: '4px',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  stepContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1,
  },
  stepTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '8px',
  },
  stepSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '16px',
    marginBottom: '30px',
  },
  photosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    maxWidth: '340px',
    width: '100%',
  },
  photoCard: {
    position: 'relative',
    aspectRatio: '3/4',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  removePhoto: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBadge: {
    position: 'absolute',
    bottom: '8px',
    left: '8px',
    background: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#fff',
  },
  addPhotoBtn: {
    aspectRatio: '3/4',
    borderRadius: '16px',
    border: '2px dashed rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.7)',
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    fontSize: '16px',
    color: '#fff',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    fontSize: '16px',
    color: '#fff',
    outline: 'none',
    resize: 'none',
    fontFamily: 'inherit',
  },
  interestsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    maxWidth: '420px',
  },
  interestChip: {
    padding: '10px 18px',
    borderRadius: '25px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
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
    width: '100%',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    marginTop: '10px',
  },
  promptsContainer: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  promptCard: {
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  promptQuestion: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#FF6B9D',
    marginBottom: '12px',
  },
  promptInput: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    fontSize: '15px',
    color: '#fff',
    outline: 'none',
  },
  navigation: {
    display: 'flex',
    gap: '16px',
    marginTop: 'auto',
    paddingTop: '30px',
    zIndex: 1,
  },
  navBtn: {
    flex: 1,
    padding: '16px',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  navBtnBack: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.8)',
  },
  navBtnNext: {
    background: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
    border: 'none',
    color: '#fff',
    boxShadow: '0 4px 20px rgba(233,30,99,0.3)',
  },
};
