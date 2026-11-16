import React from 'react';

/**
 * Catches WebGL or Three.js runtime crashes and provides a graceful fallback
 */
export class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("Canvas WebGL Error intercepted:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#0a0a12]">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/15 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-cyan-500/15 blur-[120px] animate-pulse" />
          <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-pink-500/10 blur-[100px]" />
        </div>
      );
    }

    return this.props.children;
  }
}
