import { VideoEffect } from '../types';

export const applyVideoEffect = async (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  effect: VideoEffect
) => {
  switch (effect.type) {
    case 'glitch':
      return applyGlitchEffect(ctx, effect.intensity || 0.5);
    case 'neon':
      return applyNeonEffect(ctx, effect.color || '#00ff00');
    case 'cyberpunk':
      return applyCyberpunkEffect(ctx);
    default:
      return;
  }
};

const applyGlitchEffect = (ctx: CanvasRenderingContext2D, intensity: number) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const { data } = imageData;
  
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < intensity * 0.1) {
      const offset = Math.floor(Math.random() * 30) * 4;
      data[i] = data[i + offset] || data[i];
      data[i + 1] = data[i + offset + 1] || data[i + 1];
      data[i + 2] = data[i + offset + 2] || data[i + 2];
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

const applyNeonEffect = (ctx: CanvasRenderingContext2D, color: string) => {
  ctx.shadowBlur = 15;
  ctx.shadowColor = color;
  ctx.globalCompositeOperation = 'screen';
};

const applyCyberpunkEffect = (ctx: CanvasRenderingContext2D) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const { data } = imageData;
  
  for (let i = 0; i < data.length; i += 4) {
    // Enhance blues and pinks
    if (data[i + 2] > data[i] && data[i + 2] > data[i + 1]) {
      data[i + 2] = Math.min(255, data[i + 2] * 1.2);
    }
    if (data[i] > data[i + 1] && data[i] > data[i + 2]) {
      data[i] = Math.min(255, data[i] * 1.2);
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};