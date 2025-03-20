import React, { useState, useEffect } from "react";
import "./Stars.css";
export function Stars(props) {
  const initialStars = generateRandomStars(20); // Initial stars
  const [stars, setStars] = useState(initialStars);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isTouching, setIsTouching] = useState(false);

  // Generate random stars
  function generateRandomStars(count) {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 90, // Random x position (%)
      y: Math.random() * 90, // Random y position (%)
      originalX: Math.random() * 90,
      originalY: Math.random() * 90,
      shakeX: 0,
      shakeY: 0,
    }));
  }

  // Handle mouse movement
  const handleMouseMove = (event) => {
    if (!isTouching) {
      const container = event.currentTarget.getBoundingClientRect();
      setCursor({
        x: ((event.clientX - container.left) / container.width) * 100,
        y: ((event.clientY - container.top) / container.height) * 100,
      });
    }
  };

  // Handle touch movement
  const handleTouchMove = (event) => {
    const container = event.currentTarget.getBoundingClientRect();
    setCursor({
      x: ((event.touches[0].clientX - container.left) / container.width) * 100,
      y: ((event.touches[0].clientY - container.top) / container.height) * 100,
    });
  };

  useEffect(() => {
    const repelEffect = () => {
      const newStars = stars.map((star) => {
        const distanceX = star.x - cursor.x;
        const distanceY = star.y - cursor.y;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        if (distance < 10) {
          // Repel effect when close to the cursor
          const force = 10 - distance;
          const angle = Math.atan2(distanceY, distanceX);
          const newX = star.x + Math.cos(angle) * force;
          const newY = star.y + Math.sin(angle) * force;

          // Add a small random shake effect
          const shakeX = Math.random() * 2 - 1; // Random value between -1 and 1
          const shakeY = Math.random() * 2 - 1;

          return {
            ...star,
            x: Math.min(100, Math.max(0, newX)),
            y: Math.min(100, Math.max(0, newY)),
            shakeX,
            shakeY,
          };
        } else {
          // Slowly return to the original position
          const newX = star.x + (star.originalX - star.x) * 0.05; // Smooth return
          const newY = star.y + (star.originalY - star.y) * 0.05;

          // Gradually reduce shake effect over time
          const shakeX = star.shakeX * 0.9;
          const shakeY = star.shakeY * 0.9;

          return {
            ...star,
            x: newX,
            y: newY,
            shakeX,
            shakeY,
          };
        }
      });

      setStars(newStars);
    };

    const animationFrame = () => {
      repelEffect();
      requestAnimationFrame(animationFrame);
    };

    requestAnimationFrame(animationFrame); // Start the animation loop
  }, [cursor, stars]);

  return (
    <div
      className="constellation-container"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={() => setIsTouching(true)}
      onTouchEnd={() => setIsTouching(false)}
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            transform: `translate(-50%, -50%) translate(${star.shakeX}px, ${star.shakeY}px)`, // Apply shake
          }}
        >
          ⭐
        </div>
      ))}
      <svg className="lines" width="100%" height="100%">
  {stars.map((star, i) => {
    if (i === stars.length - 1) return null; // Skip last star
    const nextStar = stars[i + 1];
    return (
      <line
        key={i}
        x1={`${star.x}%`}
        y1={`${star.y}%`}
        x2={`${nextStar.x}%`}
        y2={`${nextStar.y}%`}
        stroke="white"
        strokeWidth="2"
      />
    );
})}
      </svg>
    </div>
  );
}