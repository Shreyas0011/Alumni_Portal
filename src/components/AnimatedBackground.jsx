import React from 'react';

const AnimatedBackground = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      overflow: 'hidden',
      pointerEvents: 'none',
      background: 'radial-gradient(circle at 50% 50%, #fafafa 0%, #f4f6f9 100%)',
    }}>
      <style>{`
        @keyframes drift-one {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5vw, 8vh) scale(1.15); }
          66% { transform: translate(-3vw, 4vh) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes drift-two {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-6vw, -5vh) scale(1.12); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes drift-three {
          0% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(4vw, -9vh) scale(0.95); }
          80% { transform: translate(-2vw, 3vh) scale(1.08); }
          100% { transform: translate(0, 0) scale(1); }
        }
      `}</style>

      {/* Corporate Indigo Blob */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(59, 130, 246, 0.01) 70%)',
        filter: 'blur(75px)',
        animation: 'drift-one 24s infinite ease-in-out',
      }} />

      {/* Gold Prestige Blob (Matches the Commerce theme) */}
      <div style={{
        position: 'absolute',
        bottom: '25%',
        right: '10%',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, rgba(251, 191, 36, 0.01) 70%)',
        filter: 'blur(80px)',
        animation: 'drift-two 28s infinite ease-in-out',
      }} />

      {/* Royal Corporate Blue Blob */}
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '45%',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(29, 78, 216, 0.06) 0%, rgba(30, 58, 138, 0.01) 70%)',
        filter: 'blur(70px)',
        animation: 'drift-three 22s infinite ease-in-out',
      }} />

      {/* Soft Teal Finance Accent Blob */}
      <div style={{
        position: 'absolute',
        top: '8%',
        right: '25%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.01) 70%)',
        filter: 'blur(75px)',
        animation: 'drift-one 20s infinite ease-in-out 2s',
      }} />
    </div>
  );
};

export default AnimatedBackground;
