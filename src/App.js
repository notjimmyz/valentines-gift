import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [yesClicked, setYesClicked] = useState(false);
  const [noClicked, setNoClicked] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const noButtonRef = useRef(null);
  const containerRef = useRef(null);

  // Initialize No button position and handle window resize
  useEffect(() => {
    const updatePosition = () => {
      const buttonWidth = 120;
      const buttonHeight = 60;
      const padding = 20;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Position to the right of center, but ensure it's within bounds
      let initialX = centerX + 150;
      let initialY = centerY;
      
      const maxX = window.innerWidth - buttonWidth - padding;
      const maxY = window.innerHeight - buttonHeight - padding;
      
      initialX = Math.max(padding, Math.min(maxX, initialX));
      initialY = Math.max(padding, Math.min(maxY, initialY));
      
      setNoPosition({ x: initialX, y: initialY });
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!noButtonRef.current || yesClicked) return;
      
      const button = noButtonRef.current;
      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - buttonCenterX, 2) + 
        Math.pow(e.clientY - buttonCenterY, 2)
      );
      
      // If cursor is within 150px of the button, make it dodge
      if (distance < 150) {
        const angle = Math.atan2(
          e.clientY - buttonCenterY,
          e.clientX - buttonCenterX
        );
        
        // Move away from cursor
        const moveDistance = 150;
        let newX = noPosition.x - Math.cos(angle) * moveDistance;
        let newY = noPosition.y - Math.sin(angle) * moveDistance;
        
        // Get button dimensions (approximate if not available)
        const buttonWidth = rect.width || 120;
        const buttonHeight = rect.height || 60;
        const padding = 20;
        
        // Calculate bounds relative to viewport
        const minX = padding;
        const maxX = window.innerWidth - buttonWidth - padding;
        const minY = padding;
        const maxY = window.innerHeight - buttonHeight - padding;
        
        // Clamp to bounds and add bounce effect
        let bouncedX = false;
        let bouncedY = false;
        
        if (newX < minX) {
          newX = minX;
          bouncedX = true;
        } else if (newX > maxX) {
          newX = maxX;
          bouncedX = true;
        }
        
        if (newY < minY) {
          newY = minY;
          bouncedY = true;
        } else if (newY > maxY) {
          newY = maxY;
          bouncedY = true;
        }
        
        // If bounced, add a small random offset to make it more dynamic
        if (bouncedX || bouncedY) {
          newX += (Math.random() - 0.5) * 50;
          newY += (Math.random() - 0.5) * 50;
          
          // Re-clamp after bounce offset
          newX = Math.max(minX, Math.min(maxX, newX));
          newY = Math.max(minY, Math.min(maxY, newY));
        }
        
        setNoPosition({
          x: newX,
          y: newY
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [noPosition, yesClicked]);

  const handleYesClick = () => {
    setYesClicked(true);
  };

  const handleNoClick = () => {
    // First click changes the button text to angry version
    if (!noClicked) {
      setNoClicked(true);
    }
    
    // This will be hard to click, but if they manage it, move it away
    const buttonWidth = 120;
    const buttonHeight = 60;
    const padding = 20;
    const randomX = padding + Math.random() * (window.innerWidth - buttonWidth - padding * 2);
    const randomY = padding + Math.random() * (window.innerHeight - buttonHeight - padding * 2);
    setNoPosition({ x: randomX, y: randomY });
  };

  const handleOtterClick = () => {
    setShowItinerary(true);
  };

  return (
    <div className="valentine-container" ref={containerRef}>
      <div className="otter-background">
        <div className="otter otter-1">🦦</div>
        <div className="otter otter-2">🦦</div>
        <div className="otter otter-3">🦦</div>
        <div className="otter otter-4">🦦</div>
      </div>
      
      <div className="content">
        {!yesClicked ? (
          <>
            <h1 className="valentine-title">Will you be my valentine? 💕</h1>
            <div className="buttons-container">
              <button 
                className="button yes-button"
                onClick={handleYesClick}
              >
                Yes! 🎉
              </button>
              <button
                ref={noButtonRef}
                className="button no-button"
                onClick={handleNoClick}
                style={{
                  position: 'fixed',
                  left: `${noPosition.x}px`,
                  top: `${noPosition.y}px`,
                  transition: 'left 0.15s ease-out, top 0.15s ease-out'
                }}
              >
                {noClicked ? 'NO 😠' : 'No 😢'}
              </button>
            </div>
          </>
        ) : showItinerary ? (
          <div className="itinerary-page">
            <h1 className="itinerary-title">Our Date Itinerary 💕</h1>
            <div className="itinerary-content">
              <div className="itinerary-item">
                <div className="itinerary-time">🌅 Morning</div>
                <div className="itinerary-activity">Brunch at our favorite spot</div>
              </div>
              <div className="itinerary-item">
                <div className="itinerary-time">🌳 Afternoon</div>
                <div className="itinerary-activity">Walk in the park & feed the otters 🦦</div>
              </div>
              <div className="itinerary-item">
                <div className="itinerary-time">🎬 Evening</div>
                <div className="itinerary-activity">Movie night with popcorn & cuddles</div>
              </div>
              <div className="itinerary-item">
                <div className="itinerary-time">🌙 Night</div>
                <div className="itinerary-activity">Stargazing & sweet dreams together</div>
              </div>
            </div>
            <div className="itinerary-otters">
              <div className="itinerary-otter">🦦</div>
              <div className="itinerary-otter">🦦</div>
              <div className="itinerary-otter">🦦</div>
            </div>
          </div>
        ) : (
          <div className="success-message">
            <h1 className="success-title">Yayyyyyy bearsssss!</h1>
            <p className="success-text">You made an otter-ly amazing choice! 💖</p>
            <div className="celebration-otters">
              <div className="celebration-otter" onClick={handleOtterClick}>🦦</div>
              <div className="celebration-otter" onClick={handleOtterClick}>🦦</div>
              <div className="celebration-otter" onClick={handleOtterClick}>🦦</div>
            </div>
            <p className="otter-hint">(pst, click on one of the otters)</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
