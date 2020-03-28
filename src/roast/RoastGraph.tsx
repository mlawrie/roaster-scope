import { connect } from 'react-redux';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { RootState } from '../reducers';
import { RoastState } from '../reducers/roastReducer';
import { ConfigState } from '../reducers/configReducer';
import { useWindowSize } from '../hooks/useWindowSize';
import { useInitialRerender } from '../hooks/useInitialRerender';
import { drawRoastGraphIntoElement } from './drawRoastGraphIntoElement';

const styles = {
    container: {}
};

interface Props {
    readonly roast: RoastState;
    readonly config: ConfigState;
}

const mapStateToProps = (state: RootState) => ({ roast: state.roast, config: state.config });

const graphMargin = 50;

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
        drawRoastGraphIntoElement(props.roast, props.config, svgRef.current, {
            graphWidth,
            graphHeight,
            graphMargin
        });
    });

    return (
        <div style={styles.container}>
            <svg height={graphHeight} width={graphWidth} ref={svgRef as any} />
        </div>
    );
});
