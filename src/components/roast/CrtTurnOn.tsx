"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The signature moment: a white line stretches across a dead screen, blows up into a
 * flash, crackles with static, and the show is on. Reduced motion gets a plain fade.
 */
export function CrtTurnOn({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 bg-ink"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onAnimationComplete={onDone}
      />
    );
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-ink"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 1.4, times: [0, 0.82, 1], ease: "easeOut" }}
      onAnimationComplete={onDone}
    >
      <motion.div
        className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-paper"
        style={{ boxShadow: "0 0 18px 4px var(--paper)" }}
        initial={{ scaleX: 0.01, scaleY: 1 }}
        animate={{ scaleX: [0.01, 1, 1], scaleY: [1, 1, 320] }}
        transition={{ duration: 0.62, times: [0, 0.55, 1], ease: ["easeOut", "easeIn"] }}
      />
      <motion.div
        className="tv-static absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 1.15, times: [0, 0.5, 0.56, 0.84, 1] }}
      />
    </motion.div>
  );
}
