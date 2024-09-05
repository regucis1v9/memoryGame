import React, { useState, useEffect } from 'react';
import DOTS from 'vanta/src/vanta.dots';

const Dots = () => {
  useEffect(() => {
    let vantaEffect = DOTS({
      el: "#vanta",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0xDF7575,
      color2: 0xDF7575,
      backgroundColor: 0x222222,
    });

    // Clean up the effect when component unmounts
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  // Function to update container size
  const updateContainerSize = () => {
    const container = document.getElementById('vanta');
    if (container) {
      container.style.width = window.innerWidth + 'px';
      container.style.height = window.innerHeight + 'px';
    }
  };

  // Call the function once on component mount
  useEffect(() => {
    updateContainerSize();
    // Add event listener for window resize
    window.addEventListener('resize', updateContainerSize);
    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', updateContainerSize);
  }, []);

  return (
    <div className="main">
      <div className="bg" id="vanta"></div>
    </div>
  );
};

export default Dots;
