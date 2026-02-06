import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface GlitchTextProps {
    text: string;
    as?: keyof React.JSX.IntrinsicElements;
    className?: string;
}

export default function GlitchText({ text, as: Component = 'h1', className = '' }: GlitchTextProps) {
    const Comp = Component as any;
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        const triggerGlitch = () => {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 200);

            // Random interval between 3 and 8 seconds
            const nextDelay = Math.random() * 5000 + 3000;
            setTimeout(triggerGlitch, nextDelay);
        };

        const timer = setTimeout(triggerGlitch, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Comp className={`relative inline-block ${className}`}>
            <span className="relative z-10">{text}</span>

            {isGlitching && (
                <>
                    <span
                        className="absolute top-0 left-0 -z-10 translate-x-[2px] text-red-500 opacity-70 clip-path-inset"
                        aria-hidden="true"
                    >
                        {text}
                    </span>
                    <span
                        className="absolute top-0 left-0 -z-10 -translate-x-[2px] text-blue-500 opacity-70 clip-path-inset-2"
                        aria-hidden="true"
                    >
                        {text}
                    </span>
                </>
            )}
        </Comp>
    );
}
