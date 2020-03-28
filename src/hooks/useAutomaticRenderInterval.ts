import { useEffect, useState } from 'react';

export const useAutomaticRenderInterval = (millis: number) => {
    const [_, setRenderCount] = useState(0);

    let renderCount = 0;
    useEffect(() => {
        const interval = setInterval(() => {
            setRenderCount((renderCount += 1));
        }, millis);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return _;
};
