import { useState, useEffect, useRef } from 'react';
import './App.css';

const FLOW = {
  VALENTINE: 'valentine',
  SUCCESS: 'success',
  OUTDOOR_INDOOR: 'outdoor-indoor',
  CUISINE: 'cuisine',
  ITINERARY: 'itinerary',
};

const BUTTON_PADDING = 20;
const BUTTON_WIDTH = 120;
const BUTTON_HEIGHT = 60;

function useDodgingButton(flow, activeFlow) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (flow !== activeFlow) return;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    let initialX = centerX + 150;
    let initialY = centerY;
    const maxX = window.innerWidth - BUTTON_WIDTH - BUTTON_PADDING;
    const maxY = window.innerHeight - BUTTON_HEIGHT - BUTTON_PADDING;
    initialX = Math.max(BUTTON_PADDING, Math.min(maxX, initialX));
    initialY = Math.max(BUTTON_PADDING, Math.min(maxY, initialY));
    setPosition({ x: initialX, y: initialY });
  }, [flow, activeFlow]);

  return { buttonRef, position, setPosition };
}

function App() {
  const [flow, setFlow] = useState(FLOW.VALENTINE);
  const [noClicked, setNoClicked] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const noButtonRef = useRef(null);

  const { buttonRef: outdoorButtonRef, position: outdoorPosition, setPosition: setOutdoorPosition } = useDodgingButton(FLOW.OUTDOOR_INDOOR, flow);
  const { buttonRef: mexicanButtonRef, position: mexicanPosition, setPosition: setMexicanPosition } = useDodgingButton(FLOW.CUISINE, flow);

  // Initialize No button position and handle window resize
  useEffect(() => {
    const updatePosition = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      let initialX = centerX + 150;
      let initialY = centerY;
      const maxX = window.innerWidth - BUTTON_WIDTH - BUTTON_PADDING;
      const maxY = window.innerHeight - BUTTON_HEIGHT - BUTTON_PADDING;
      initialX = Math.max(BUTTON_PADDING, Math.min(maxX, initialX));
      initialY = Math.max(BUTTON_PADDING, Math.min(maxY, initialY));
      setNoPosition({ x: initialX, y: initialY });
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  const dodgeButton = (buttonRef, pos, setPos) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    return (e) => {
      const distance = Math.sqrt(
        Math.pow(e.clientX - buttonCenterX, 2) + Math.pow(e.clientY - buttonCenterY, 2)
      );
      if (distance >= 150) return;

      const angle = Math.atan2(e.clientY - buttonCenterY, e.clientX - buttonCenterX);
      const moveDistance = 150;
      let newX = pos.x - Math.cos(angle) * moveDistance;
      let newY = pos.y - Math.sin(angle) * moveDistance;

      const bw = rect.width || BUTTON_WIDTH;
      const bh = rect.height || BUTTON_HEIGHT;
      const minX = BUTTON_PADDING;
      const maxX = window.innerWidth - bw - BUTTON_PADDING;
      const minY = BUTTON_PADDING;
      const maxY = window.innerHeight - bh - BUTTON_PADDING;

      if (newX < minX) newX = minX;
      else if (newX > maxX) newX = maxX;
      if (newY < minY) newY = minY;
      else if (newY > maxY) newY = maxY;

      setPos({ x: newX, y: newY });
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (flow === FLOW.VALENTINE) {
        if (!noButtonRef.current) return;
        const handler = dodgeButton(noButtonRef, noPosition, setNoPosition);
        handler(e);
      } else if (flow === FLOW.OUTDOOR_INDOOR) {
        if (!outdoorButtonRef.current) return;
        const handler = dodgeButton(outdoorButtonRef, outdoorPosition, setOutdoorPosition);
        handler(e);
      } else if (flow === FLOW.CUISINE) {
        if (!mexicanButtonRef.current) return;
        const handler = dodgeButton(mexicanButtonRef, mexicanPosition, setMexicanPosition);
        handler(e);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [flow, noPosition, outdoorPosition, mexicanPosition]);

  const moveDodgingButton = (setPos) => {
    const randomX = BUTTON_PADDING + Math.random() * (window.innerWidth - BUTTON_WIDTH - BUTTON_PADDING * 2);
    const randomY = BUTTON_PADDING + Math.random() * (window.innerHeight - BUTTON_HEIGHT - BUTTON_PADDING * 2);
    setPos({ x: randomX, y: randomY });
  };

  const handleYesClick = () => setFlow(FLOW.SUCCESS);
  const handleNoClick = () => {
    if (!noClicked) setNoClicked(true);
    moveDodgingButton(setNoPosition);
  };
  const handleOtterClick = () => setFlow(FLOW.OUTDOOR_INDOOR);
  const handleIndoorClick = () => setFlow(FLOW.CUISINE);
  const handleOutdoorClick = () => moveDodgingButton(setOutdoorPosition);
  const handleCuisineClick = () => setFlow(FLOW.ITINERARY);
  const handleMexicanClick = () => {
    moveDodgingButton(setMexicanPosition);
    setFlow(FLOW.ITINERARY);
  };

  const itineraryItems = [
    { time: '9:00AM', activity: 'Wake up, get ready' },
    { time: '10:00AM', activity: 'Leave for SF' },
    { time: '11:00AM', activity: 'LE TACCCCC (right when it opens), bring to Dolores Park to eat and chat' },
    { time: '1:00PM', activity: 'Arsicault Bakery (97 Arguello Blvd)' },
    { time: '2:00PM', activity: 'Walk around Golden Gate Park/Presidio' },
    { time: '5:00PM', activity: 'Head back to Berkeley' },
    { time: '6:00PM', activity: 'Berkeley Bowl' },
    { time: '7:00PM', activity: 'Make food :D (Beef Wellington, Chimmichuri Steak Frites, Char Siu, ANYTHING)' },
    { time: '9:00PM', activity: 'Chat/Finish Knives Out/Cuddle' },
  ];

  return (
    <div className="valentine-container">
      <div className="otter-background">
        <div className="otter otter-1">🦦</div>
        <div className="otter otter-2">🦦</div>
        <div className="otter otter-3">🦦</div>
        <div className="otter otter-4">🦦</div>
      </div>

      <div className="content">
        {flow === FLOW.VALENTINE && (
          <>
            <h1 className="valentine-title">Will you be my valentine? 💕</h1>
            <div className="buttons-container">
              <button className="button yes-button" onClick={handleYesClick}>Yes! 🎉</button>
              <button
                ref={noButtonRef}
                className="button no-button"
                onClick={handleNoClick}
                style={{
                  position: 'fixed',
                  left: `${noPosition.x}px`,
                  top: `${noPosition.y}px`,
                  transition: 'left 0.15s ease-out, top 0.15s ease-out',
                }}
              >
                {noClicked ? 'NO 😡' : 'No 😢'}
              </button>
            </div>
          </>
        )}

        {flow === FLOW.SUCCESS && (
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

        {flow === FLOW.OUTDOOR_INDOOR && (
          <div className="choice-screen">
            <h1 className="choice-title">Outdoor or Indoor? 🌤️</h1>
            <div className="choice-buttons">
              <button className="button yes-button choice-btn" onClick={handleIndoorClick}>Indoor 🏠</button>
              <button
                ref={outdoorButtonRef}
                className="button no-button choice-btn"
                onClick={handleOutdoorClick}
                style={{
                  position: 'fixed',
                  left: `${outdoorPosition.x}px`,
                  top: `${outdoorPosition.y}px`,
                  transition: 'left 0.15s ease-out, top 0.15s ease-out',
                }}
              >
                Outdoor 🌳
              </button>
            </div>
          </div>
        )}

        {flow === FLOW.CUISINE && (
          <div className="choice-screen">
            <h1 className="choice-title">What cuisine? 🍽️</h1>
            <div className="cuisine-buttons">
              <button className="button cuisine-btn" onClick={handleCuisineClick}>Japanese 🍣</button>
              <button className="button cuisine-btn" onClick={handleCuisineClick}>Chinese 🥡</button>
              <button className="button cuisine-btn" onClick={handleCuisineClick}>Italian 🍝</button>
              <button
                ref={mexicanButtonRef}
                className="button no-button"
                onClick={handleMexicanClick}
                style={{
                  position: 'fixed',
                  left: `${mexicanPosition.x}px`,
                  top: `${mexicanPosition.y}px`,
                  transition: 'left 0.15s ease-out, top 0.15s ease-out',
                }}
              >
                Mexican 🌮
              </button>
            </div>
          </div>
        )}

        {flow === FLOW.ITINERARY && (
          <div className="itinerary-page">
            <h1 className="itinerary-title">Our Date Itinerary 💕</h1>
            <p className="itinerary-subtitle">jk, ik ur ass wanted mexican food, here's the itinerary:</p>
            <div className="itinerary-content">
              {itineraryItems.map((item, i) => (
                <div key={i} className="itinerary-item">
                  <div className="itinerary-time">{item.time}</div>
                  <div className="itinerary-activity">{item.activity}</div>
                </div>
              ))}
            </div>
            <div className="itinerary-otters">
              <div className="itinerary-otter">🦦</div>
              <div className="itinerary-otter">🦦</div>
              <div className="itinerary-otter">🦦</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
