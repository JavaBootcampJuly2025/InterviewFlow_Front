import { useState, useEffect } from 'react';

export function ResponsiveTest() {
    const [screenSize, setScreenSize] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        const updateSize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const getBreakpoint = () => {
        if (screenSize.width < 640) return 'xs';
        if (screenSize.width < 768) return 'sm';
        if (screenSize.width < 1024) return 'md';
        if (screenSize.width < 1280) return 'lg';
        return 'xl';
    };
}
