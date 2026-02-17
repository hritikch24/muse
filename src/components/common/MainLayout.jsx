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

  const getPageTitle = () => {
    switch(location.pathname) {
      case '/': return 'Discover';
      case '/matches': return 'Matches';
      case '/moments': return 'Moments';
      case '/profile': return 'Profile';
      default: return 'Muse';
    }
  };

  return (
    <div style={styles.container}>
      {/* Top Bar */}
      <header style={styles.header}>
        <Link to="/" style={styles.logoLink}>
          <span style={styles.logo}>
            M<span style={styles.logoAccent}>u</span>se
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main style={styles.content}>
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
      </main>

      {/* Bottom Navigation */}
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
                style={styles.navItemInner}
              >
                <div style={styles.iconWrapper}>
                  <Icon size={22} style={{ 
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'color 0.2s ease'
                  }} />
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
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
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
    background: 'var(--bg-dark)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    paddingTop: 'calc(16px + var(--safe-area-top))',
    background: 'rgba(13, 13, 13, 0.98)',
    borderBottom: '1px solid var(--surface-glass-border)',
    flexShrink: 0,
    zIndex: 100,
  },
  logoLink: {
    textDecoration: 'none',
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'var(--text-logo)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  logoAccent: {
    color: 'var(--primary)',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  pageWrapper: {
    height: '100%',
    overflow: 'auto',
    overflowX: 'hidden',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '12px 8px calc(20px + var(--safe-area-bottom))',
    background: 'rgba(13, 13, 13, 0.98)',
    borderTop: '1px solid var(--surface-glass-border)',
    flexShrink: 0,
    zIndex: 100,
  },
  navItem: {
    textDecoration: 'none',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  navItemInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px',
    position: 'relative',
    minWidth: '56px',
  },
  iconWrapper: {
    position: 'relative',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: '-6px',
    right: '-10px',
    minWidth: '16px',
    height: '16px',
    padding: '0 4px',
    background: 'var(--primary)',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: 600,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: '11px',
    transition: 'all 0.2s ease',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: '-8px',
    width: '20px',
    height: '3px',
    background: 'var(--primary)',
    borderRadius: '2px',
  },
};
