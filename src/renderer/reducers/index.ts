import { combineReducers } from 'redux';

import { roastReducer, RoastState } from './roastReducer';
import { configReducer, ConfigState } from './configReducer';

export interface RootState {
    roast: RoastState;
    config: ConfigState;
}

export const rootReducer = combineReducers<RootState | undefined>({
    roast: roastReducer,
    config: configReducer
});
