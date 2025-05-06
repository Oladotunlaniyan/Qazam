import React, { useEffect, useState } from 'react';

interface ListeningAnimationProps {
  isListening: boolean;
}

const ListeningAnimation: React.FC<ListeningAnimationProps> = ({ isListening }) => {
  const [circles, setCircles] = useState<number[]>([]);
  
  useEffect(() => {
    if (isListening) {
      // Create 3 circles with different sizes and animation delays
      setCircles([1, 2, 3]);
    } else {
      setCircles([]);
    }
  }, [isListening]);

  if (!isListening) return null;
  
  return (
    <div className="relative flex items-center justify-center my-8">
      {circles.map((circle) => (
        <div
          key={circle}
          className={`
            absolute rounded-full bg-blue-500 opacity-70
            animate-ping-slow
          `}
          style={{
            width: `${circle * 50}px`,
            height: `${circle * 50}px`,
            animationDelay: `${(circle - 1) * 0.3}s`,
            animationDuration: '2s',
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default ListeningAnimation;