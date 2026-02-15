import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaGoogle, FaFacebookF, FaStar, FaEye, FaEyeSlash } from 'react-icons/fa';
import useStore from '../store/useStore';
import '../styles/globals.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [particles, setParticles] = useState([]);
  const [showSocialToast, setShowSocialToast] = useState(false);
  const [socialToastMessage, setSocialToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useStore(state => state.login);
  const signup = useStore(state => state.signup);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(newParticles);
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin) {
      if (!name.trim()) {
        newErrors.name = 'Name is required';
      } else if (name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSocialLogin = (provider) => {
    setSocialToastMessage(`${provider} login coming soon!`);
    setShowSocialToast(true);
    setTimeout(() => setShowSocialToast(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      if (isLogin) {
        // For login, check if user exists in localStorage or create demo user
        login(email, password);
        navigate('/');
      } else {
        signup({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          age: 25,
          bio: 'Looking for something real',
          photos: ['https://randomuser.me/api/portraits/women/44.jpg'],
          interests: ['Music', 'Travel', 'Food'],
          prompts: [{ question: 'A fact about me', answer: 'Building this app!' }],
          location: 'Your Location',
          distance: 0,
          onboardingCompleted: false
        });
        navigate('/onboarding');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            style={{
              ...styles.particle,
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{ y: [0, -100, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
          />
        ))}
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
        <div style={styles.shape3}></div>
        <div style={styles.shape4}></div>
      </div>

      <motion.div style={styles.logoContainer} initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <motion.div style={styles.logoWrapper} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
          <FaStar style={styles.logoIcon} />
        </motion.div>
        <h1 style={styles.logo}>M<span style={styles.logoAccent}>u</span>se</h1>
        <motion.p style={styles.tagline} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          Find your perfect connection
        </motion.p>
        <motion.div style={styles.hearts} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} style={styles.heart} animate={{ scale: [1, 1.3, 1], y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.15 }} />
          ))}
        </motion.div>
      </motion.div>

      <motion.div style={styles.card} initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div style={styles.tabs}>
          <button style={{...styles.tab, ...(isLogin ? styles.tabActive : {})}} onClick={() => setIsLogin(true)}>Sign In</button>
          <button style={{...styles.tab, ...(!isLogin ? styles.tabActive : {})}} onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={isLogin ? 'login' : 'signup'} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <p style={styles.subtitle}>{isLogin ? 'Welcome back! Sign in to continue' : 'Create your profile and start connecting'}</p>
            <form onSubmit={handleSubmit} style={styles.form}>
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div style={styles.inputGroup}>
                    <input 
                      type="text" 
                      placeholder="Your name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      style={errors.name ? {...styles.input, ...styles.inputError} : styles.input} 
                    />
                    {errors.name && <p style={styles.errorText}>{errors.name}</p>}
                  </div>
                </motion.div>
              )}
              <div style={styles.inputGroup}>
                <input 
                  type="email" 
                  placeholder="Email address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  style={errors.email ? {...styles.input, ...styles.inputError} : styles.input} 
                />
                {errors.email && <p style={styles.errorText}>{errors.email}</p>}
              </div>
              <div style={styles.inputGroup}>
                <div style={styles.passwordWrapper}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={errors.password ? {...styles.input, ...styles.inputError, ...styles.passwordInput} : {...styles.input, ...styles.passwordInput}} 
                  />
                  <button 
                    type="button" 
                    style={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {errors.password && <p style={styles.errorText}>{errors.password}</p>}
              </div>
              {!isLogin && <p style={styles.terms}>By signing up, you agree to our Terms of Service and Privacy Policy</p>}
              <motion.button 
                type="submit" 
                style={isLoading ? {...styles.submitBtn, ...styles.submitBtnDisabled} : styles.submitBtn} 
                whileHover={!isLoading ? { scale: 1.02 } : {}} 
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                disabled={isLoading}
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                {!isLoading && <FaHeart style={styles.btnIcon} />}
              </motion.button>
            </form>
          </motion.div>
        </AnimatePresence>

        <div style={styles.divider}><span>or continue with</span></div>

        <div style={styles.socialBtns}>
          <motion.button style={styles.socialBtn} whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.15)' }} whileTap={{ scale: 0.95 }} onClick={() => handleSocialLogin('Google')}>
            <FaGoogle size={20} />Google
          </motion.button>
          <motion.button style={styles.socialBtn} whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.15)' }} whileTap={{ scale: 0.95 }} onClick={() => handleSocialLogin('Facebook')}>
            <FaFacebookF size={20} />Facebook
          </motion.button>
        </div>

        <p style={styles.footerText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Sign up' : 'Sign in'}</span>
        </p>

        {/* Social Toast */}
        <AnimatePresence>
          {showSocialToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={styles.socialToast}
            >
              {socialToastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' },
  background: { position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)' },
  particle: { position: 'absolute', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,157,0.8) 0%, transparent 70%)' },
  shape1: { position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,30,99,0.3) 0%, transparent 70%)', top: '-200px', left: '-150px', animation: 'pulse 8s ease-in-out infinite' },
  shape2: { position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(156,39,176,0.25) 0%, transparent 70%)', bottom: '-100px', right: '-100px', animation: 'pulse 10s ease-in-out infinite reverse' },
  shape3: { position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,157,0.2) 0%, transparent 70%)', top: '30%', right: '10%', animation: 'float 12s ease-in-out infinite' },
  shape4: { position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(33,150,243,0.2) 0%, transparent 70%)', bottom: '30%', left: '5%', animation: 'float 15s ease-in-out infinite reverse' },
  logoContainer: { textAlign: 'center', marginBottom: '40px', zIndex: 1 },
  logoWrapper: { marginBottom: '10px' },
  logoIcon: { fontSize: '48px', color: '#FF6B9D', filter: 'drop-shadow(0 0 20px rgba(233,30,99,0.5))' },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: '72px', fontWeight: 700, color: '#fff', letterSpacing: '-3px', textShadow: '0 4px 40px rgba(233,30,99,0.5)', margin: 0 },
  logoAccent: { color: '#FF6B9D' },
  tagline: { color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginTop: '8px', marginBottom: '15px' },
  hearts: { display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '10px' },
  heart: { width: '16px', height: '16px', background: 'linear-gradient(135deg, #E91E63, #FF6B9D)', transform: 'rotate(45deg)', clipPath: 'polygon(50% 0%, 100% 35%, 80% 100%, 50% 75%, 20% 100%, 0% 35%)' },
  card: { width: '100%', maxWidth: '420px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '28px', padding: '36px', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '5px' },
  tab: { flex: 1, padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' },
  tabActive: { background: 'linear-gradient(135deg, #E91E63, #FF6B9D)', color: '#fff', boxShadow: '0 4px 15px rgba(233,30,99,0.4)' },
  subtitle: { textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '15px', marginBottom: '28px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  inputGroup: { width: '100%' },
  input: { width: '100%', padding: '16px 20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', fontSize: '16px', color: '#fff', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' },
  terms: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.5 },
  submitBtn: { width: '100%', padding: '18px', background: 'linear-gradient(135deg, #E91E63, #FF6B9D)', border: 'none', borderRadius: '14px', fontSize: '17px', fontWeight: 600, color: '#fff', cursor: 'pointer', marginTop: '14px', boxShadow: '0 8px 25px rgba(233,30,99,0.4)', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  btnIcon: { fontSize: '14px' },
  divider: { display: 'flex', alignItems: 'center', margin: '26px 0', color: 'rgba(255,255,255,0.4)', fontSize: '14px' },
  socialBtns: { display: 'flex', gap: '12px' },
  socialBtn: { flex: 1, padding: '14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#fff', fontSize: '14px', fontWeight: 500, transition: 'all 0.3s ease' },
  footerText: { textAlign: 'center', marginTop: '26px', color: 'rgba(255,255,255,0.6)', fontSize: '15px' },
  link: { color: '#FF6B9D', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' },
  socialToast: {
    position: 'fixed',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    padding: '14px 24px',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  inputError: {
    border: '1px solid #F44336 !important',
    background: 'rgba(244,67,54,0.1) !important',
  },
  errorText: {
    color: '#F44336',
    fontSize: '12px',
    marginTop: '4px',
    textAlign: 'left',
  },
  passwordWrapper: {
    position: 'relative',
    width: '100%',
  },
  passwordInput: {
    paddingRight: '50px',
  },
  eyeBtn: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    padding: '4px',
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
};
