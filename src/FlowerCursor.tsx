import React, { useEffect } from 'react';

export default function FlowerCursor() {
  useEffect(() => {
    const flowers = ['🌸', '🌺', '🌷', '✨', '🌼'];

    const handleMouseMove = (e: MouseEvent) => {
      const flower = document.createElement('span');
      flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];

      Object.assign(flower.style, {
        position: 'fixed',
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        pointerEvents: 'none',
        fontSize: '18px',
        transform: 'translate(-50%, -50%) scale(1)',
        transition: 'all 0.8s ease-out',
        opacity: '1',
        zIndex: '99999',
      });

      document.body.appendChild(flower);

      requestAnimationFrame(() => {
        flower.style.opacity = '0';
        flower.style.transform = 'translate(-50%, -100%) scale(1.5)';
      });

      setTimeout(() => {
        flower.remove();
      }, 800);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null;
}