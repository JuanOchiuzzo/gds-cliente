import type { Transition, Variants } from 'framer-motion';

// ── Springs ─────────────────────────────────────────────────
export const spring: Transition = { type: 'spring', stiffness: 420, damping: 36 };
export const springSoft: Transition = { type: 'spring', stiffness: 200, damping: 28 };
export const springFirm: Transition = { type: 'spring', stiffness: 560, damping: 40 };
export const springBouncy: Transition = { type: 'spring', stiffness: 300, damping: 18 };

// ── Eases ───────────────────────────────────────────────────
export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

// ── Stagger container ───────────────────────────────────────
export const staggerParent = (stagger = 0.06, delay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

// ── Slide up child ──────────────────────────────────────────
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

export const slideUpSmall: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOut } },
};

// ── Scale fade ──────────────────────────────────────────────
export const scaleFade: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: easeOut } },
};

// ── Tap / hover ─────────────────────────────────────────────
export const tap = { scale: 0.97 };
export const hoverLift = { y: -2, transition: spring };
export const hoverGlow = { scale: 1.03, transition: spring };

// ── Page transition ─────────────────────────────────────────
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOut } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: easeOut } },
};
