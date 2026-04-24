'use client';

import confetti from 'canvas-confetti';

const SOLAR_COLORS = ['#5BF1C6', '#F0D994', '#8FB7FF', '#FFFFFF'];

export function fireConfetti() {
  const duration = 2500;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: SOLAR_COLORS,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: SOLAR_COLORS,
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function fireBurst() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 },
    colors: SOLAR_COLORS,
  });
}
