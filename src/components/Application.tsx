import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import { RoastGraph } from '../roastGraph/RoastGraph';

const Application = () => (
    <div>
        <RoastGraph />
    </div>
);

export default hot(Application);
