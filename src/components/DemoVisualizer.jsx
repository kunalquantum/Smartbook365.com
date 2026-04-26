import React, { Suspense } from 'react';

/**
 * DemoVisualizer wraps a subject simulator for display on the landing page.
 * It provides a constrained environment and a premium "Interactive Lab" feel.
 */
const DemoVisualizer = ({ Simulator, accentColor = '#00FFFF' }) => {
  if (!Simulator) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '192px',
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      borderRadius: '12px',
      border: '1px dashed rgba(51, 65, 85, 1)'
    }}>
      <span style={{ color: 'rgba(100, 116, 139, 1)', fontFamily: 'monospace', fontSize: '14px' }}>
        Visualizer Pending...
      </span>
    </div>
  );

  return (
    <div className="visualizer-container" style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '16px',
      backgroundColor: 'rgba(2, 6, 23, 0.4)',
      border: '1px solid rgba(30, 41, 59, 1)',
      transition: 'all 0.3s ease',
      height: '100%'
    }}>
      {/* Header Badge */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '2px 8px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(51, 65, 85, 0.5)'
        }}>
          <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
            <span style={{
              position: 'absolute',
              display: 'inline-flex',
              height: '100%',
              width: '100%',
              borderRadius: '9999px',
              backgroundColor: accentColor,
              opacity: 0.75,
              animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
            }}></span>
            <span style={{
              position: 'relative',
              display: 'inline-flex',
              borderRadius: '9999px',
              height: '8px',
              width: '8px',
              backgroundColor: accentColor
            }}></span>
          </span>
          <span style={{
            fontSize: '10px',
            fontWeight: 'bold',
            color: 'rgba(203, 213, 225, 1)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontFamily: 'monospace'
          }}>Interactive</span>
        </div>
      </div>

      {/* Simulator Container */}
      <div className="custom-scrollbar" style={{
        padding: '16px',
        paddingTop: '48px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'auto'
      }}>
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'center', height: '100%', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
            <div style={{ width: '32px', height: '32px', border: '2px solid rgba(51, 65, 85, 1)', borderTopColor: 'rgba(148, 163, 184, 1)', borderRadius: '9999px', animation: 'spin 1s linear infinite' }}></div>
          </div>
        }>
          <div style={{ transformOrigin: 'center', transition: 'transform 0.5s ease' }}>
             <Simulator />
          </div>
        </Suspense>
      </div>

      {/* Interaction Hint Overlay */}
      <div className="interaction-overlay" style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(2, 6, 23, 0.8), transparent, transparent)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: '16px',
        pointerEvents: 'none',
        opacity: 0,
        transition: 'opacity 0.3s ease'
      }}>
        <div style={{
          padding: '6px 16px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          fontSize: '11px',
          fontWeight: '500',
          letterSpacing: '0.025em'
        }}>
          Click to Interact
        </div>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        .visualizer-container:hover .interaction-overlay {
          opacity: 1;
        }
        .visualizer-container:hover {
          border-color: rgba(71, 85, 105, 1) !important;
        }
      `}</style>
    </div>
  );
};

export default DemoVisualizer;
