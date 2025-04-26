import React, { useEffect, useRef } from 'react';

interface WaveAnimationProps {
  isAnimating: boolean;
}

const WaveAnimation: React.FC<WaveAnimationProps> = ({ isAnimating }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let waves: { amplitude: number; frequency: number; phase: number; color: string }[] = [
      { amplitude: 25, frequency: 0.02, phase: 0, color: 'rgba(37, 99, 235, 0.2)' },
      { amplitude: 15, frequency: 0.03, phase: 2, color: 'rgba(79, 70, 229, 0.3)' },
      { amplitude: 10, frequency: 0.04, phase: 4, color: 'rgba(124, 58, 237, 0.4)' },
    ];

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      waves.forEach(wave => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.offsetHeight / 2);
        
        for (let x = 0; x < canvas.offsetWidth; x++) {
          const y = canvas.offsetHeight / 2 + 
                   Math.sin(x * wave.frequency + wave.phase) * 
                   wave.amplitude * (isAnimating ? 1 : 0.1);
          
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(canvas.offsetWidth, canvas.offsetHeight / 2);
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Update phase for movement
        if (isAnimating) {
          wave.phase += 0.05;
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isAnimating]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-32 mb-6 mt-6"
      aria-hidden="true"
    />
  );
};

export default WaveAnimation;