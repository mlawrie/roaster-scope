import { connect } from 'react-redux';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { RootState } from '../reducers';
import { MeasurementPoint, RoastState } from '../reducers/roastReducer';
import { ConfigState, MeasureConfig } from '../reducers/configReducer';
import { useWindowSize } from '../hooks/useWindowSize';
import { useInitialRerender } from '../hooks/useInitialRerender';
import { rateOfRise } from '../util/coffeeMath';

const styles = {
    container: {}
};

interface Props {
    readonly roast: RoastState;
    readonly config: ConfigState;
}

const mapStateToProps = (state: RootState) => ({ roast: state.roast, config: state.config });

const graphMargin = 50;

const lineFromMeasure = (
    measurements: MeasurementPoint[],
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScaleLinear<number, number>
) => {
    const values: [number, number][] = measurements.map(m => [m.time, m.value]);

    return d3
        .line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]))
        .curve(d3.curveCatmullRom.alpha(0.7))(values)!;
};

const drawGraph = (
    props: Props,
    svgElement: HTMLElement,
    graphDimensions: { graphWidth: number; graphHeight: number }
) => {
    const { graphWidth, graphHeight } = graphDimensions;
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    const allMeasures = ([] as MeasurementPoint[]).concat(
        ...Object.keys(props.roast.measures).map(k => props.roast.measures[k])
    );

    const temperatureDomain = d3.extent([
        props.config.temperatureMax,
        props.config.temperatureMin
    ]) as [number, number];
    const temperatureScale = d3
        .scaleLinear()
        .domain(temperatureDomain)
        .range([graphHeight - graphMargin, graphMargin]);

    const timeDomain = d3.extent(allMeasures, m => m.time) as [number, number];
    const timeScale = d3
        .scaleLinear()
        .domain(timeDomain)
        .range([graphMargin, graphWidth - graphMargin]);

    const rateOfRiseDomain = d3.extent([0, props.config.rateOfRiseMax]) as [number, number];
    const rateOfRiseScale = d3
        .scaleLinear()
        .domain(rateOfRiseDomain)
        .range([graphHeight - graphMargin, graphMargin]);

    props.config.measures.forEach(config => {
        svg.append('path')
            .attr(
                'd',
                lineFromMeasure(props.roast.measures[config.name], timeScale, temperatureScale)
            )
            .attr('fill', 'none')
            .attr('stroke', config.color)
            .attr('stroke-width', '2');

        if (config.showRateOfRise) {
            svg.append('path')
                .attr(
                    'd',
                    lineFromMeasure(
                        rateOfRise(
                            props.roast.measures[config.name],
                            props.config.rateOfRiseTimeBasis
                        ),
                        timeScale,
                        rateOfRiseScale
                    )
                )
                .attr('fill', 'none')
                .attr('stroke', config.color)
                .attr('stroke-width', '1');
        }
    });

    const yAxis = d3.axisLeft(temperatureScale);
    const xAxis = d3.axisBottom(timeScale);

    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${graphMargin - 10},0)`)
        .call(yAxis);

    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${0},${graphHeight - graphMargin + 10})`)
        .call(xAxis);
};

export const RoastGraph = connect(mapStateToProps)((props: Props) => {
    const size = useWindowSize();
    const svgRef = useRef<HTMLElement>(null);
    const graphWidth = size.width || 0;
    const graphHeight = (size.height || 0) - 200;

    useInitialRerender();
    useEffect(() => {
        if (!props.roast || !svgRef.current) {
            return;
        }
        drawGraph(props, svgRef.current, { graphWidth, graphHeight });
    });

    return (
        <div style={styles.container}>
            <svg height={graphHeight} width={graphWidth} ref={svgRef as any} />
        </div>
    );
});
