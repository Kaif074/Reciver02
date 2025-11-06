import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, remove, onValue, off } from 'firebase/database';

// ==================== FIREBASE CONFIGURATION ====================
const firebaseConfig = {
  apiKey: "AIzaSyCp-LfozVypM0zyzoeFJRMPHZV3FIANfFY",
  authDomain: "laser-scanner-fa514.firebaseapp.com",
  databaseURL: "https://laser-scanner-fa514-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "laser-scanner-fa514",
  storageBucket: "laser-scanner-fa514.firebasestorage.app",
  messagingSenderId: "476242080920",
  appId: "1:476242080920:web:2e7aa5c5a65c5bcccdcced",
  measurementId: "G-KPJFQZ37SJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const messagesRef = ref(database, 'radiatron/messages');

// ==================== BRAINWAVE GRAPH COMPONENT ====================
function BrainwaveGraph({ type, position }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Wave parameters based on brainwave type
    const waveConfigs = {
      gamma: { frequency: 40, amplitude: 15, speed: 3, color: 'rgba(0, 255, 0, 0.8)' },
      beta: { frequency: 20, amplitude: 20, speed: 2.5, color: 'rgba(0, 255, 0, 0.7)' },
      alpha: { frequency: 10, amplitude: 25, speed: 2, color: 'rgba(0, 255, 0, 0.6)' },
      theta: { frequency: 6, amplitude: 30, speed: 1.5, color: 'rgba(0, 255, 0, 0.5)' },
      delta: { frequency: 2, amplitude: 35, speed: 1, color: 'rgba(0, 255, 0, 0.4)' }
    };
    
    const config = waveConfigs[type] || waveConfigs.alpha;
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw grid lines
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
      
      // Draw waveform
      ctx.strokeStyle = config.color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'lime';
      
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = height / 2 + 
          Math.sin((x + offsetRef.current) * config.frequency * 0.01) * config.amplitude +
          Math.sin((x + offsetRef.current * 0.5) * config.frequency * 0.02) * (config.amplitude * 0.3);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
      ctx.font = '12px monospace';
      ctx.shadowBlur = 5;
      ctx.fillText(type.toUpperCase(), 10, 20);
      
      offsetRef.current += config.speed;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type]);
  
  const positionStyles = {
    topLeft: { top: '20px', left: '20px' },
    topRight: { top: '20px', right: '20px' },
    bottomLeft: { bottom: '20px', left: '20px' },
    bottomRight: { bottom: '20px', right: '20px' },
    middleLeft: { top: '50%', left: '20px', transform: 'translateY(-50%)' }
  };
  
  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={100}
      style={{
        position: 'absolute',
        ...positionStyles[position],
        border: '1px solid rgba(0, 255, 0, 0.3)',
        borderRadius: '5px',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10
      }}
    />
  );
}

// ==================== LOADING SCREEN COMPONENT ====================
function LoadingScreen({ progress }) {
  const [displayProgress, setDisplayProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayProgress(prev => {
        if (prev < progress) {
          return Math.min(prev + 1, progress);
        }
        return prev;
      });
    }, 45);
    
    return () => clearInterval(timer);
  }, [progress]);
  
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayProgress / 100) * circumference;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle, rgba(0, 255, 0, 0.05) 0%, #000 100%)',
      zIndex: 1000
    }}>
      <div style={{ position: 'relative' }}>
        <svg width="250" height="250" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="125"
            cy="125"
            r={radius}
            fill="none"
            stroke="rgba(0, 255, 0, 0.1)"
            strokeWidth="4"
          />
          
          {/* Progress circle */}
          <circle
            cx="125"
            cy="125"
            r={radius}
            fill="none"
            stroke="lime"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease',
              filter: 'drop-shadow(0 0 10px lime) drop-shadow(0 0 20px lime)',
            }}
          />
          
          {/* Dots around the circle */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const x = 125 + Math.cos(angle) * (radius + 15);
            const y = 125 + Math.sin(angle) * (radius + 15);
            const isActive = (displayProgress / 100) * 20 > i;
            
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill={isActive ? 'lime' : 'rgba(0, 255, 0, 0.2)'}
                style={{
                  filter: isActive ? 'drop-shadow(0 0 5px lime)' : '',
                  transition: 'all 0.3s ease'
                }}
              />
            );
          })}
        </svg>
        
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            fontFamily: 'monospace',
            color: 'lime',
            textShadow: '0 0 20px lime',
            marginBottom: '10px'
          }}>
            {displayProgress}%
          </div>
          <div style={{
            fontSize: '14px',
            fontFamily: 'monospace',
            color: 'rgba(0, 255, 0, 0.8)',
            textShadow: '0 0 10px lime',
            letterSpacing: '2px'
          }}>
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN APP COMPONENT ====================
function App() {
  const [messages, setMessages] = useState([]);
  const [receiverState, setReceiverState] = useState('welcome'); // Start with 'welcome'
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [messageVisible, setMessageVisible] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showBrainwaves, setShowBrainwaves] = useState(false);

  // ==================== FIREBASE LISTENERS ====================
  useEffect(() => {
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        messageList.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        setMessages(messageList);
      } else {
        setMessages([]);
      }
    });

    return () => off(messagesRef);
  }, []);

  // ==================== INTRO & LOADING SEQUENCE ====================
  useEffect(() => {
    const sequence = async () => {
      // Show "Welcome" for 3 seconds
      setMessageVisible(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Fade out
      setMessageVisible(false);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Show "RADIATRON X-9 DRS" for 10 seconds
      setReceiverState('intro');
      setMessageVisible(true);
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Fade out
      setMessageVisible(false);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show "R-SCOPE / X-9" for 3 seconds
      setReceiverState('rscope');
      setMessageVisible(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Fade out
      setMessageVisible(false);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show loading screen for 6 seconds total
      setReceiverState('loading');
      
      // Animate loading from 0 to 100% over 5 seconds
      for (let i = 0; i <= 100; i += 1) {
        setLoadingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Hold at 100% for 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Start message playback
      setReceiverState('playback');
      setShowBrainwaves(true);
      setCurrentMessageIndex(0);
      setMessageVisible(true);
    };
    
    sequence();
  }, []);

  // ==================== MESSAGE PLAYBACK ====================
  useEffect(() => {
    if (receiverState !== 'playback' || messages.length === 0) return;
    
    // Don't set timer if we're on the last message
    if (currentMessageIndex >= messages.length - 1) {
      setMessageVisible(true);
      return;
    }
    
    const playbackTimer = setTimeout(() => {
      setMessageVisible(false);
      
      setTimeout(() => {
        setCurrentMessageIndex(currentMessageIndex + 1);
        setMessageVisible(true);
      }, 500);
    }, 10000);

    return () => clearTimeout(playbackTimer);
  }, [receiverState, currentMessageIndex, messages.length]);

  // ==================== RENDER CURRENT CONTENT ====================
  const renderContent = () => {
    if (receiverState === 'welcome') {
      return (
        <div className={`message-display ${messageVisible ? 'visible' : ''}`}>
          <div className="welcome-title">Welcome</div>
          <div className="pulse-line"></div>
        </div>
      );
    }

    if (receiverState === 'intro') {
      return (
        <div className={`message-display ${messageVisible ? 'visible' : ''}`}>
          <div className="radiatron-title">RADIATRON X-9 DRS</div>
          <div className="pulse-line"></div>
        </div>
      );
    }
    
    if (receiverState === 'rscope') {
      return (
        <div className={`message-display ${messageVisible ? 'visible' : ''}`}>
          <div className="rscope-title">R-SCOPE</div>
          <div className="x9-subtitle">X-9</div>
          <div className="pulse-line"></div>
        </div>
      );
    }
    
    if (receiverState === 'loading') {
      return <LoadingScreen progress={loadingProgress} />;
    }
    
    if (receiverState === 'playback' && messages[currentMessageIndex]) {
      const message = messages[currentMessageIndex];
      
      return (
        <>
          {showBrainwaves && (
            <>
              <BrainwaveGraph type="gamma" position="topLeft" />
              <BrainwaveGraph type="beta" position="topRight" />
              <BrainwaveGraph type="alpha" position="bottomLeft" />
              <BrainwaveGraph type="theta" position="bottomRight" />
              <BrainwaveGraph type="delta" position="middleLeft" />
            </>
          )}
          <div className={`message-display ${messageVisible ? 'visible' : ''}`}>
            <div className="message-content">
              {message.text}
            </div>
          </div>
        </>
      );
    }
    
    // If no messages available
    if (receiverState === 'playback' && messages.length === 0) {
      return (
        <>
          {showBrainwaves && (
            <>
              <BrainwaveGraph type="gamma" position="topLeft" />
              <BrainwaveGraph type="beta" position="topRight" />
              <BrainwaveGraph type="alpha" position="bottomLeft" />
              <BrainwaveGraph type="theta" position="bottomRight" />
              <BrainwaveGraph type="delta" position="middleLeft" />
            </>
          )}
          <div className="message-display visible">
            <div className="standby-message">
              AWAITING TRANSMISSIONS
            </div>
          </div>
        </>
      );
    }
    
    return null;
  };

  return (
    <div className="App">
      <div className="receiver-container">
        <div className="scanline"></div>
        <div className="grid-overlay"></div>
        {renderContent()}
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Courier New', monospace;
          background: #000;
          color: lime;
          overflow: hidden;
          position: relative;
        }

        .App {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle at center, rgba(0, 255, 0, 0.05) 0%, #000 100%);
          transform: rotate(180deg);
          transform-origin: center center;
        }

        .receiver-container {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(180deg, #000 0%, rgba(0, 255, 0, 0.02) 50%, #000 100%);
        }

        .message-display {
          text-align: center;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
          padding: 40px;
          max-width: 80%;
        }

        .message-display.visible {
          opacity: 1;
        }

        .welcome-title {
          font-size: 72px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 8px;
          color: lime;
          text-shadow: 
            0 0 20px lime,
            0 0 40px lime,
            0 0 60px lime,
            0 0 80px rgba(0, 255, 0, 0.5);
          animation: pulse 2s ease-in-out infinite;
        }

        .radiatron-title, .rscope-title {
          font-size: 72px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 8px;
          color: lime;
          text-shadow: 
            0 0 20px lime,
            0 0 40px lime,
            0 0 60px lime,
            0 0 80px rgba(0, 255, 0, 0.5);
          animation: pulse 2s ease-in-out infinite;
        }

        .rscope-title {
          font-size: 64px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 8px;
          color: lime;
          text-shadow: 
            0 0 20px lime,
            0 0 40px lime,
            0 0 60px lime,
            0 0 80px rgba(0, 255, 0, 0.5);
          animation: pulse 2s ease-in-out infinite;
          margin-bottom: 20px;
        }

        .x9-subtitle {
          font-size: 48px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 12px;
          color: lime;
          text-shadow: 
            0 0 20px lime,
            0 0 40px lime,
            0 0 60px lime,
            0 0 80px rgba(0, 255, 0, 0.5);
          animation: pulse 2s ease-in-out infinite;
          margin-bottom: 30px;
        }

        .message-content {
          font-size: 64px;
          line-height: 1.5;
          margin: 30px auto;
          text-transform: uppercase;
          letter-spacing: 6px;
          color: lime;
          text-shadow: 
            0 0 10px lime,
            0 0 20px lime,
            0 0 30px rgba(0, 255, 0, 0.8),
            0 0 40px rgba(0, 255, 0, 0.6);
          max-width: 90%;
        }

        .standby-message {
          font-size: 32px;
          letter-spacing: 4px;
          color: rgba(0, 255, 0, 0.6);
          text-shadow: 0 0 15px rgba(0, 255, 0, 0.4);
          animation: blink 2s ease-in-out infinite;
        }

        .pulse-line {
          width: 200px;
          height: 2px;
          margin: 30px auto;
          background: lime;
          box-shadow: 0 0 20px lime;
          animation: pulse-width 2s ease-in-out infinite;
        }

        .scanline {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(180deg, 
            transparent 0%, 
            rgba(0, 255, 0, 0.3) 50%, 
            transparent 100%);
          animation: scanline 8s linear infinite;
          z-index: 1;
        }

        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 50px,
              rgba(0, 255, 0, 0.03) 50px,
              rgba(0, 255, 0, 0.03) 51px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 50px,
              rgba(0, 255, 0, 0.03) 50px,
              rgba(0, 255, 0, 0.03) 51px
            );
          pointer-events: none;
          z-index: 2;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes pulse-width {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.5); }
        }

        @keyframes scanline {
          0% { top: 0; }
          100% { top: 100%; }
        }

        @keyframes blink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default App;
