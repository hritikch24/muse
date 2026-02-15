import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f0f1a',
          color: '#fff',
          padding: '20px'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Something went wrong</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
            Please refresh the app to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Refresh App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
