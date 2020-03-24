import { Reducer } from 'redux';

export interface MeasureConfig {
    name: 'ET' | 'BT';
    units: 'Celsius' | 'Fahrenheit';
    showRateOfRise: boolean;
    color: string;
}

export interface ConfigState {
    readonly measures: MeasureConfig[];
    readonly rateOfRiseMax: number;
    readonly temperatureMax: number;
    readonly temperatureMin: number;
    readonly rateOfRiseTimeBasis: number;
}

const defaultState: ConfigState = {
    rateOfRiseMax: 50,
    rateOfRiseTimeBasis: 30,
    temperatureMax: 600,
    temperatureMin: 150,
    measures: [
        {
            name: 'ET',
            units: 'Fahrenheit',
            showRateOfRise: false,
            color: 'red'
        },
        {
            name: 'BT',
            units: 'Fahrenheit',
            showRateOfRise: true,
            color: 'blue'
        }
    ]
};

export const configReducer: Reducer<ConfigState> = (state = defaultState, action: {}) => {
    return state;
};
