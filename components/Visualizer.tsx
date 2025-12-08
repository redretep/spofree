
import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  analyser: AnalyserNode;
  isPlaying: boolean;
  accentColor?: string;
}

export const Visualizer: React.FC<VisualizerProps> = ({ analyser, isPlaying, accentColor = '#1db954' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isPlaying) {
        // Optional: clear or keep last frame. Let's keep last frame for cool pause effect? 
        // Or fade out. Let's cancel to save battery.
        cancelAnimationFrame(animationRef.current);
        return;
      }

      animationRef.current = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);

      // Bar settings
      // We want to skip the very high frequencies which are often empty
      const usableLength = Math.floor(bufferLength * 0.7);
      const barWidth = (width / usableLength); 
      let barHeight;
      let x = 0;

      for (let i = 0; i < usableLength; i++) {
        // Scale height to fit
        const value = dataArray[i];
        const percent = value / 255;
        barHeight = percent * height;

        // Dynamic Color based on accent
        ctx.fillStyle = accentColor;
        
        // Draw bottom up
        // ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
        
        // Draw mirrored (Top and Bottom) for a "Waveform" look
        // Center Y is height / 2
        // const h = barHeight / 2;
        // ctx.fillRect(x, (height / 2) - h, barWidth - 0.5, barHeight);
        
        // Simple Bottom-Up looks best for a progress bar
        // Add some transparency to the top
        ctx.globalAlpha = 0.6 + (percent * 0.4);
        ctx.fillRect(x, height - barHeight, barWidth + 1, barHeight);

        x += barWidth;
      }
      ctx.globalAlpha = 1.0;
    };

    // Resize observer to handle fluid widths
    const resizeObserver = new ResizeObserver(entries => {
        if (!canvas) return;
        const { width, height } = entries[0].contentRect;
        canvas.width = width;
        canvas.height = height;
    });
    
    resizeObserver.observe(canvas.parentElement!);

    if (isPlaying) {
        draw();
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, [analyser, isPlaying, accentColor]);

  return (
    <div className="w-full h-full">
        <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
