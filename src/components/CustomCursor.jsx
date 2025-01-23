import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const updateCursorPosition = (e) => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
    }

    const target = e.target;
    setIsPointer(
      window.getComputedStyle(target).cursor === 'pointer' ||
      target.tagName.toLowerCase() === 'a' ||
      target.tagName.toLowerCase() === 'button' ||
      target.closest('a') ||
      target.closest('button')
    );
  };

  useEffect(() => {
    // Add event listeners
    window.addEventListener('mousemove', updateCursorPosition);
    window.addEventListener('mousedown', () => setIsClicking(true));
    window.addEventListener('mouseup', () => setIsClicking(false));

    // Cleanup on unmount
    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      window.removeEventListener('mousedown', () => setIsClicking(true));
      window.removeEventListener('mouseup', () => setIsClicking(false));
    };
  }, []);

  return (
    <>
      <style>
        {`
          body {
            cursor: none !important;
          }

          a, button, [role="button"] {
            cursor: none !important;
          }

          .cursor {
            width: 32px;
            height: 32px;
            position: fixed;
            top: 0;
            left: 0;
            transform: translate(-50%, -50%);
            z-index: 9999;
            pointer-events: none;
            transition: transform 0.1s ease-out;
          }

          .cursor::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(
              circle at center,
              rgba(219, 175, 118, 0.8) 0%,
              rgba(219, 175, 118, 0.4) 50%,
              transparent 100%
            );
            border-radius: 50%;
            transform: scale(1.2);
            transition: transform 0.3s ease;
          }

          .cursor::after {
            content: '';
            position: absolute;
            inset: -4px;
            border: 2px solid rgba(219, 175, 118, 0.6);
            border-radius: 50%;
            opacity: 0.8;
            transition: all 0.3s ease;
          }

          .cursor.pointer {
            transform: translate(-50%, -50%) scale(1.5);
          }

          .cursor.pointer::before {
            transform: scale(0.8);
            background: radial-gradient(
              circle at center,
              rgba(219, 175, 118, 0.9) 0%,
              rgba(219, 175, 118, 0.5) 70%,
              transparent 100%
            );
          }

          .cursor.pointer::after {
            animation: cursorPulse 2s infinite;
            border-style: dashed;
          }

          .cursor.clicking {
            transform: translate(-50%, -50%) scale(0.9);
          }

          .cursor.clicking::before {
            transform: scale(0.7);
            background: radial-gradient(
              circle at center,
              rgba(219, 175, 118, 1) 0%,
              rgba(219, 175, 118, 0.6) 60%,
              transparent 100%
            );
          }

          @keyframes cursorPulse {
            0% {
              transform: scale(1);
              opacity: 0.8;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.4;
            }
            100% {
              transform: scale(1);
              opacity: 0.8;
            }
          }

          @keyframes cursorRotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .cursor.pointer::before {
            animation: cursorRotate 12s linear infinite;
          }
        `}
      </style>
      <div
        ref={cursorRef}
        className={`cursor ${isPointer ? 'pointer' : ''} ${isClicking ? 'clicking' : ''}`}
      />
    </>
  );
};

export default CustomCursor;