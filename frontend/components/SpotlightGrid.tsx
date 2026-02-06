import { useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

export default function SpotlightGrid() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
            onMouseMove={handleMouseMove}
        >
            {/* Base Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.15]" />

            {/* Spotlight Effect */}
            <motion.div
                className="absolute inset-0 bg-[url('/grid.svg')] opacity-40"
                style={{
                    maskImage: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              black,
              transparent
            )
          `,
                    WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              black,
              transparent
            )
          `,
                }}
            />

            {/* Scanline overlay */}
            <div className="scanline" />
        </div>
    );
}
