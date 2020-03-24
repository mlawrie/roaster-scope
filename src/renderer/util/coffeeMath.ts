import { MeasurementPoint } from '../reducers/roastReducer';

const derivative = (measurements: MeasurementPoint[]) =>
    measurements.map((measurement, index) => {
        const last: MeasurementPoint =
            index === 0 ? { value: 0, time: 0 } : measurements[index - 1];
        if (measurement.time - last.time === 0) {
            return { value: 0, time: measurement.time };
        }
        return {
            value: (measurement.value - last.value) / (measurement.time - last.time),
            time: measurement.time
        };
    });

export const rateOfRise = (measurements: MeasurementPoint[], timeInterval: number) =>
    derivative(measurements).map(m => ({
        value: m.value * timeInterval,
        time: m.time
    }));
