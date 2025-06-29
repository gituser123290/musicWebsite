import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMusic } from "react-icons/fa";

// Donut SVG component
const Donut = (props) => (
  <svg
    {...props}
    viewBox="0 0 64 64"
    fill="none"
    stroke="rgba(255, 165, 0, 0.8)"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="32" cy="32" r="20" />
    <circle cx="32" cy="32" r="10" fill="rgba(255, 192, 203, 0.6)" />
  </svg>
);

// Sprinkle SVG component
const Sprinkle = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255, 105, 180, 0.8)"
    strokeWidth="3"
    strokeLinecap="round"
  >
    <line x1="12" y1="4" x2="12" y2="20" />
    <line x1="4" y1="12" x2="20" y2="12" />
  </svg>
);

/**
 * FlyingIcons component shows animated flying icons (music notes, sprinkles, donuts).
 *
 * @param {boolean} active - If true, icons will spawn and animate continuously.
 * @param {number} intervalMs - Spawn interval in milliseconds (default 300).
 * @param {number} durationMs - Duration of each icon animation (default 2500).
 */
export default function FlyingIcons({ active, intervalMs = 300, durationMs = 2500 }) {
  const [flyIcons, setFlyIcons] = useState([]);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const left = Math.random() * 100;

      const types = ['music', 'sprinkle', 'donut'];
      const type = types[Math.floor(Math.random() * types.length)];

      setFlyIcons((icons) => [...icons, { id, left, type }]);

      setTimeout(() => {
        setFlyIcons((icons) => icons.filter(icon => icon.id !== id));
      }, durationMs);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [active, intervalMs, durationMs]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
      {flyIcons.map(({ id, left, type }) => {
        const commonProps = {
          key: id,
          initial: { y: 0, opacity: 0.8, scale: 1, x: `${left}%` },
          animate: { y: -150, opacity: 0, scale: 0.5 },
          transition: { duration: durationMs / 1000, ease: "easeOut" },
          style: {
            position: 'absolute',
            left: `${left}%`,
            bottom: 20,
            userSelect: 'none',
            pointerEvents: 'none',
          }
        };

        if (type === 'music') {
          return (
            <motion.div
              {...commonProps}
              style={{
                ...commonProps.style,
                color: 'rgba(30, 215, 96, 0.7)',
                filter: 'drop-shadow(0 0 4px rgba(30,215,96,0.8))',
              }}
            >
              <FaMusic size={24} />
            </motion.div>
          );
        }

        if (type === 'sprinkle') {
          return (
            <motion.div
              {...commonProps}
              style={{
                ...commonProps.style,
                filter: 'drop-shadow(0 0 4px rgba(255,105,180,0.7))',
                width: 20,
                height: 20,
              }}
            >
              <Sprinkle width={20} height={20} />
            </motion.div>
          );
        }

        if (type === 'donut') {
          return (
            <motion.div
              {...commonProps}
              style={{
                ...commonProps.style,
                filter: 'drop-shadow(0 0 6px rgba(255,165,0,0.9))',
                width: 24,
                height: 24,
              }}
            >
              <Donut width={24} height={24} />
            </motion.div>
          );
        }

        return null;
      })}
    </div>
  );
}
