import { useEffect, useState } from 'react';
import * as lodash from 'lodash';

export const useWindowSize = () => {
    const isClient = typeof window === 'object';

    const getSize = () => {
        return {
            width: isClient ? window.innerWidth : 0,
            height: isClient ? window.innerHeight : 0
        };
    };

    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
        if (!isClient) {
            return undefined;
        }

        const handleResize = lodash.debounce(() => {
            setWindowSize(getSize());
        }, 100);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return windowSize;
};
