import React, { useState, useEffect } from 'react';

const MouseRing: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div 
      className="fixed pointer-events-none z-[9999] hidden md:block"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '30px',
        height: '30px',
        border: '3px solid #22d3ee',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 15px rgba(34, 211, 238, 0.6), inset 0 0 10px rgba(34, 211, 238, 0.4)',
        transition: 'none'
      }}
    />
  );
};

export default MouseRing;
