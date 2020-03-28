import * as d3 from 'd3';
import * as moment from 'moment';
import { MeasurementPoint, RoastState } from '../reducers/roastReducer';
import { rateOfRise } from '../util/coffeeMath';
import { ConfigState } from '../reducers/configReducer';

interface GraphDimensions {
    graphWidth: number;
    graphHeight: number;
    graphMargin: number;
}
type Scale = d3.ScaleLinear<number, number>;
type Point = [number, number];
type D3Svg = d3.Selection<any, any, any, any>;

const lineFromMeasure = (measurements: MeasurementPoint[], xScale: Scale, yScale: Scale) => {
    const values: Point[] = measurements.map(m => [m.time, m.value]);

    return d3
        .line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]))
        .curve(d3.curveCatmullRom.alpha(0.7))(values)!;
};

const getDomains = (roast: RoastState, config: ConfigState, dimensions: GraphDimensions) => {
    const { graphWidth, graphHeight, graphMargin } = dimensions;

    const allMeasures = ([] as MeasurementPoint[]).concat(
        ...Object.keys(roast.measures).map(k => roast.measures[k])
    );

    const temperatureDomain = d3.extent([config.temperatureMax, config.temperatureMin]) as Point;
    const rateOfRiseDomain = d3.extent([0, config.rateOfRiseMax]) as Point;
    const timeDomain = d3.extent(allMeasures, m => m.time) as Point;

    return {
        temperatureScale: d3
            .scaleLinear()
            .domain(temperatureDomain)
            .range([graphHeight - graphMargin, graphMargin]),
        timeScale: d3
            .scaleLinear()
            .domain(timeDomain)
            .range([graphMargin, graphWidth - graphMargin]),
        rateOfRiseScale: d3
            .scaleLinear()
            .domain(rateOfRiseDomain)
            .range([graphHeight - graphMargin, graphMargin])
    };
};

const timeAxisTick = (n: number | { valueOf: () => number }) => {
    const pad = (i: number) => `${i}`.padStart(2, '0');
    const val: number = n.valueOf();

    const minutes = Math.floor(val / 60);
    const seconds = val - minutes * 60;

    return `${pad(minutes)}:${pad(seconds)}`;
};

const drawAxes = (svg: D3Svg, dimensions: GraphDimensions, xScale: Scale, yScale: Scale) => {
    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale).tickFormat(timeAxisTick);

    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${dimensions.graphMargin - 10},0)`)
        .call(yAxis)
        .call(g => g.select('.domain').remove())
        .call(g =>
            g
                .selectAll('.tick line')
                .attr('stroke-opacity', 0.3)
                .attr('x1', '0')
                .attr('x2', `${dimensions.graphWidth - dimensions.graphMargin - 30}`)
                .attr('stroke-dasharray', '2,2')
        );

    svg.append('g')
        .attr('class', 'axis')
        .attr(
            'transform',
            `translate(${0},${dimensions.graphHeight - dimensions.graphMargin + 10})`
        )
        .call(xAxis)
        .call(g => g.select('.domain').remove())
        .call(g =>
            g
                .selectAll('.tick line')
                .attr('stroke-opacity', 0.3)
                .attr('y1', '0')
                .attr('y2', `-${dimensions.graphHeight - dimensions.graphMargin - 30}`)
                .attr('stroke-dasharray', '2,2')
        );
};

export const drawRoastGraphIntoElement = (
    roast: RoastState,
    config: ConfigState,
    svgElement: HTMLElement,
    dimensions: GraphDimensions
) => {
    const { rateOfRiseScale, temperatureScale, timeScale } = getDomains(roast, config, dimensions);

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    config.measures.forEach(measureConfig => {
        svg.append('path')
            .attr(
                'd',
                lineFromMeasure(roast.measures[measureConfig.name], timeScale, temperatureScale)
            )
            .attr('fill', 'none')
            .attr('stroke', measureConfig.color)
            .attr('stroke-width', '2');

        if (measureConfig.showRateOfRise) {
            svg.append('path')
                .attr(
                    'd',
                    lineFromMeasure(
                        rateOfRise(roast.measures[measureConfig.name], config.rateOfRiseTimeBasis),
                        timeScale,
                        rateOfRiseScale
                    )
                )
                .attr('fill', 'none')
                .attr('stroke', measureConfig.color)
                .attr('stroke-width', '1');
        }
    });

    drawAxes(svg, dimensions, timeScale, temperatureScale);
};
