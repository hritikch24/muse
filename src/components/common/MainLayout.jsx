import { Outlet, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaCompass, FaHeart, FaPlayCircle, FaUser } from 'react-icons/fa';
import useStore from '../../store/useStore';
import '../../styles/globals.css';

const navItems = [
  { path: '/', icon: FaCompass, label: 'Discover' },
  { path: '/matches', icon: FaHeart, label: 'Matches' },
  { path: '/moments', icon: FaPlayCircle, label: 'Moments' },
  { path: '/profile', icon: FaUser, label: 'Profile' },
];

export default function MainLayout() {
  const location = useLocation();
  const notifications = useStore(state => state.notifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={styles.container}>
      {/* Top Bar with Logo */}
      <div style={styles.topBar}>
        <Link to="/" style={styles.logoLink}>
          <span style={styles.logo}>M<span style={styles.logoAccent}>u</span>se</span>
        </Link>
      </div>

      <div style={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={styles.pageWrapper}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>

      <nav style={styles.nav}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              style={styles.navItem}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 16px', position: 'relative', color: isActive ? '#FF6B9D' : 'rgba(255,255,255,0.6)', textDecoration: 'none', width: '100%' }}
              >
                <div style={styles.iconWrapper}>
                  <Icon size={22} />
                  {item.path === '/matches' && unreadCount > 0 && (
                    <motion.span 
                      style={styles.badge}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </div>
                <span style={{
                  ...styles.navLabel,
                  color: isActive ? '#FF6B9D' : 'rgba(255,255,255,0.6)',
                  fontWeight: isActive ? 600 : 400,
                }}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    style={styles.activeIndicator}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#1A1A2E',
    overflow: 'hidden',
    paddingTop: 'var(--safe-area-top)',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  pageWrapper: {
    height: '100%',
    overflow: 'auto',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '12px 8px calc(24px + var(--safe-area-bottom))',
    background: 'rgba(26, 26, 46, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 16px',
    position: 'relative',
    color: 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    minHeight: '48px',
  },
  iconWrapper: {
    position: 'relative',
    width: '28px',
    height: '28px',
  },
  badge: {
    position: 'absolute',
    top: '-6px',
    right: '-10px',
    minWidth: '18px',
    height: '18px',
    background: '#E91E63',
    borderRadius: '9px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 5px',
  },
  navLabel: {
    fontSize: '11px',
    transition: 'all 0.2s ease',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: '-12px',
    width: '24px',
    height: '3px',
    background: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
    borderRadius: '2px',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    background: 'rgba(26, 26, 46, 0.95)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  logoLink: {
    textDecoration: 'none',
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    fontWeight: 700,
    color: '#fff',
    textShadow: '0 2px 20px rgba(233,30,99,0.4)',
  },
  logoAccent: {
    color: '#FF6B9D',
  },
};
