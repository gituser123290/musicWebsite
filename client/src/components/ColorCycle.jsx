import { useEffect, useState } from "react";

export default function AutoColorCycle({ intervalMs = 1000, targetSelector = "body" }) {
  const [index, setIndex] = useState(0);
  const [textColors, setTextColors] = useState([]);
  const [bgColors, setBgColors] = useState([]);

  // parse color helpers (same as before)
  function parseRGBA(rgba) {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return null;
    return [
      parseInt(match[1], 10),
      parseInt(match[2], 10),
      parseInt(match[3], 10),
      match[4] !== undefined ? parseFloat(match[4]) : 1,
    ];
  }
  function toRGBA([r, g, b, a]) {
    return `rgba(${r},${g},${b},${a})`;
  }
  function adjustColor(colorArr, amount) {
    return colorArr.map((v, i) => {
      if (i === 3) return v; // alpha unchanged
      let val = Math.min(255, Math.max(0, v + 255 * amount));
      return Math.round(val);
    });
  }

  useEffect(() => {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    const computedStyle = getComputedStyle(target);
    const textColor = parseRGBA(computedStyle.color) || [255, 255, 255, 1];
    const bgColor = parseRGBA(computedStyle.backgroundColor) || [0, 0, 0, 1];

    const steps = 5;
    const tColors = [];
    const bColors = [];

    for (let i = 0; i < steps; i++) {
      const amount = (i / (steps - 1)) * 2 - 1; // -1 to 1
      tColors.push(toRGBA(adjustColor(textColor, amount * 0.3)));
      bColors.push(toRGBA(adjustColor(bgColor, amount * 0.5)));
    }
    setTextColors(tColors);
    setBgColors(bColors);
  }, [targetSelector]);

  useEffect(() => {
    if (textColors.length === 0 || bgColors.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % Math.min(textColors.length, bgColors.length));
    }, intervalMs);

    return () => clearInterval(interval);
  }, [textColors, bgColors, intervalMs]);

  // Apply styles directly to the target element (like <body>)
  useEffect(() => {
    const target = document.querySelector(targetSelector);
    if (!target || textColors.length === 0 || bgColors.length === 0) return;

    target.style.color = textColors[index];
    target.style.backgroundColor = bgColors[index];
    target.style.transition = "color 0.7s ease, background-color 0.7s ease";

    // Cleanup on unmount: reset colors (optional)
    return () => {
      target.style.color = "";
      target.style.backgroundColor = "";
      target.style.transition = "";
    };
  }, [index, textColors, bgColors, targetSelector]);

  // No UI rendered by this component
  return null;
}
