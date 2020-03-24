import { Reducer } from 'redux';

import { DECREMENT, INCREMENT, CounterAction } from '../actions/counterActions';
import { MeasureConfig } from './configReducer';

export interface RoastEvent {
    name:
        | 'Charge'
        | 'Dry End'
        | 'First Crack Start'
        | 'First Crack End'
        | 'Second Crack Start'
        | 'Second Crack End'
        | 'Drop';
    time: number;
}

export interface MeasurementPoint {
    time: number;
    value: number;
}

export interface RoastMeasurement {
    name: MeasureConfig['name'];
    measurements: MeasurementPoint[];
}

export interface RoastState {
    readonly startTime: Date;
    readonly events: RoastEvent[];
    readonly measures: {
        [key: string]: MeasurementPoint[];
    };
}

const defaultState: RoastState = {
    startTime: new Date(),
    events: [
        { name: 'Charge', time: 30 },
        { name: 'Dry End', time: 60 * 2 + 12 },
        { name: 'First Crack Start', time: 9 * 60 + 5 },
        { name: 'First Crack End', time: 10 * 60 + 10 },
        { name: 'Second Crack Start', time: 10 * 60 + 45 },
        { name: 'Second Crack End', time: 12 * 60 + 2 },
        { name: 'Drop', time: 12 * 60 + 5 }
    ],
    measures: {
        ET: [
            { time: 0, value: 520 },
            { time: 120, value: 480 },
            { time: 13 * 60, value: 500 }
        ],
        BT: [
            { time: 0, value: 410 },
            { time: 60, value: 180 },
            { time: 4 * 60, value: 320 },
            { time: 9 * 60, value: 385 },
            { time: 10 * 60, value: 412 },
            { time: 10 * 60 + 45, value: 418 },
            { time: 12 * 60 + 10, value: 430 },
            { time: 13 * 60, value: 460 }
        ]
    }
};

export const roastReducer: Reducer<RoastState> = (state = defaultState, action: CounterAction) => {
    return state;
};
