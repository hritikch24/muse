import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaGoogle, FaFacebookF, FaStar, FaEye, FaEyeSlash } from 'react-icons/fa';
import useStore, { findUserByEmail } from '../store/useStore';
import '../styles/globals.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useStore(state => state.login);
  const signup = useStore(state => state.signup);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: '', color: '#555' };
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25;
    if (/\d/.test(pwd)) strength += 25;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 25;
    const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#FF4757', '#FFA502', '#FFD700', '#7BED9F', '#00D26A'];
    return { strength, label: labels[Math.floor(strength / 25)], color: colors[Math.floor(strength / 25)] };
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
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      newErrors.password = 'Password must have uppercase and lowercase';
    } else if (!/\d/.test(password)) {
      newErrors.password = 'Password must contain a number';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      if (isLogin) {
        const success = login(email, password);
        if (success) {
          navigate('/');
        } else {
          const user = findUserByEmail(email.trim().toLowerCase());
          if (!user) {
            setErrors({ email: 'No account found. Please sign up first.' });
          } else {
            setErrors({ password: 'Incorrect password. Please try again.' });
          }
        }
      } else {
        const existingUser = findUserByEmail(email.trim().toLowerCase());
        if (existingUser) {
          setErrors({ email: 'An account with this email already exists. Please sign in.' });
          setIsLoading(false);
          return;
        }
        
        const success = signup({
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
        }, password);
        if (success) {
          navigate('/onboarding');
        } else {
          setErrors({ email: 'An error occurred. Please try again.' });
        }
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div style={styles.container}>
      {/* Background Effects */}
      <div style={styles.background}>
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
        <div style={styles.shape3}></div>
      </div>

      {/* Logo Section */}
      <motion.div 
        style={styles.logoContainer} 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
      >
        <div style={styles.logoWrapper}>
          <FaStar style={styles.logoIcon} />
        </div>
        <h1 style={styles.logo}>
          M<span style={styles.logoAccent}>u</span>se
        </h1>
        <motion.p 
          style={styles.tagline} 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3 }}
        >
          Find your perfect connection
        </motion.p>
      </motion.div>

      {/* Auth Card */}
      <motion.div 
        style={styles.card} 
        initial={{ opacity: 0, y: 30, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Tabs */}
        <div style={styles.tabs}>
          <button 
            style={{...styles.tab, ...(isLogin ? styles.tabActive : {})}} 
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button 
            style={{...styles.tab, ...(!isLogin ? styles.tabActive : {})}} 
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Subtitle */}
        <p style={styles.subtitle}>
          {isLogin ? 'Welcome back!' : 'Create your profile'}
        </p>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            style={styles.form}
          >
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
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
                inputMode="email"
                autoComplete="email"
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
                  autoComplete="current-password"
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
              
              {!isLogin && password && (
                <div style={styles.passwordStrength}>
                  <div style={styles.strengthBar}>
                    <div style={{
                      ...styles.strengthFill, 
                      width: getPasswordStrength(password).strength + '%', 
                      background: getPasswordStrength(password).color
                    }} />
                  </div>
                  <span style={{color: getPasswordStrength(password).color, fontSize: '12px'}}>
                    {getPasswordStrength(password).label}
                  </span>
                </div>
              )}
            </div>

            {!isLogin && (
              <p style={styles.terms}>
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            )}
            
            <motion.button 
              type="submit" 
              style={isLoading ? {...styles.submitBtn, ...styles.submitBtnDisabled} : styles.submitBtn}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              disabled={isLoading}
            >
              {isLoading ? (
                <span style={styles.spinner}></span>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <FaHeart style={styles.btnIcon} />
                </>
              )}
            </motion.button>
          </motion.form>
        </AnimatePresence>

        {/* Divider */}
        <div style={styles.divider}>
          <span>or continue with</span>
        </div>

        {/* Social Login */}
        <div style={styles.socialBtns}>
          <button style={styles.socialBtn}>
            <FaGoogle size={20} />
            Google
          </button>
          <button style={styles.socialBtn}>
            <FaFacebookF size={20} />
            Facebook
          </button>
        </div>

        {/* Footer */}
        <p style={styles.footerText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-lg)',
    position: 'relative',
    overflow: 'hidden',
    background: 'var(--bg-dark)',
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
    background: 'radial-gradient(circle, rgba(255, 77, 109, 0.15) 0%, transparent 70%)',
    top: '-200px',
    left: '-150px',
  },
  shape2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(156, 39, 176, 0.15) 0%, transparent 70%)',
    bottom: '-100px',
    right: '-100px',
  },
  shape3: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
    top: '40%',
    right: '-50px',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: 'var(--space-xl)',
    zIndex: 1,
  },
  logoWrapper: {
    marginBottom: 'var(--space-sm)',
  },
  logoIcon: {
    fontSize: '48px',
    color: 'var(--primary)',
    filter: 'drop-shadow(0 0 20px rgba(255, 77, 109, 0.5))',
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'var(--text-5xl)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-2px',
    margin: 0,
  },
  logoAccent: {
    color: 'var(--primary)',
  },
  tagline: {
    color: 'var(--text-secondary)',
    fontSize: 'var(--text-base)',
    marginTop: 'var(--space-sm)',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    background: 'var(--surface)',
    borderRadius: 'var(--radius-xl)',
    padding: 'var(--space-lg)',
    zIndex: 1,
    border: '1px solid var(--surface-glass-border)',
    boxShadow: 'var(--shadow-lg)',
  },
  tabs: {
    display: 'flex',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-lg)',
    background: 'var(--surface-glass)',
    borderRadius: 'var(--radius-md)',
    padding: '4px',
  },
  tab: {
    flex: 1,
    padding: '14px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--text-muted)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tabActive: {
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(255, 77, 109, 0.3)',
  },
  subtitle: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: 'var(--text-base)',
    marginBottom: 'var(--space-lg)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  inputGroup: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    background: 'var(--surface-glass)',
    border: '1px solid var(--surface-glass-border)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-base)',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'all 0.3s ease',
    minHeight: '56px',
  },
  inputError: {
    border: '1px solid var(--accent-error) !important',
    background: 'rgba(255, 71, 87, 0.1) !important',
  },
  terms: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  submitBtn: {
    width: '100%',
    padding: '18px',
    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
    marginTop: 'var(--space-sm)',
    boxShadow: 'var(--shadow-glow)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    minHeight: '56px',
  },
  btnIcon: {
    fontSize: '14px',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: 'var(--space-lg) 0',
    color: 'var(--text-muted)',
    fontSize: 'var(--text-sm)',
  },
  socialBtns: {
    display: 'flex',
    gap: 'var(--space-sm)',
  },
  socialBtn: {
    flex: 1,
    padding: '14px',
    background: 'var(--surface-glass)',
    border: '1px solid var(--surface-glass-border)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    color: 'var(--text-primary)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    transition: 'all 0.3s ease',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 'var(--space-lg)',
    color: 'var(--text-secondary)',
    fontSize: 'var(--text-sm)',
  },
  link: {
    color: 'var(--primary)',
    fontWeight: 600,
    cursor: 'pointer',
  },
  errorText: {
    color: 'var(--accent-error)',
    fontSize: 'var(--text-xs)',
    marginTop: '6px',
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
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  passwordStrength: {
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
  },
  strengthBar: {
    flex: 1,
    height: '4px',
    background: 'var(--surface-glass)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    transition: 'all 0.3s ease',
    borderRadius: '2px',
  },
};
