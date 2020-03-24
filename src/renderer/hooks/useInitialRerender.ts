import { useEffect, useState } from 'react';

export const useInitialRerender = () => {
    const [rerenderTriggered, setRerenderTriggered] = useState(false);

    useEffect(() => {
        setRerenderTriggered(true);
    }, []);

    return rerenderTriggered;
};
