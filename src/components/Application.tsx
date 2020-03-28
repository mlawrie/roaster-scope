import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import { RoastGraph } from '../roast/RoastGraph';
import {RoastDescription} from '../roast/RoastDescription'

const Application = () => (
    <div>
        <RoastDescription />
        <RoastGraph />
    </div>
);

export default hot(Application);
