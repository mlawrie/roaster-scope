import { connect } from 'react-redux';
import * as React from 'react';
import * as moment from 'moment';
import { RootState } from '../reducers';
import { RoastState, updateRoastTitle } from '../reducers/roastReducer';
import { useAutomaticRenderInterval } from '../hooks/useAutomaticRenderInterval';

const styles = require('./RoastDescription.scss');

interface Props {
    readonly roast: RoastState;
    readonly dispatch: (action: any) => void;
}

const mapStateToProps = (state: RootState) => ({ roast: state.roast });

export const RoastDescription = connect(mapStateToProps)((props: Props) => {
    const { dispatch, roast } = props;

    useAutomaticRenderInterval(1000);

    return (
        <div className={styles.container}>
            <input
                className={styles.title}
                type="text"
                value={roast.title}
                placeholder="Enter roast name/description"
                onChange={e => dispatch(updateRoastTitle({ title: e.target.value }))}
                />
            <div className={styles.timer}>
                {moment(moment().diff(moment(props.roast.startTime))).format('mm:ss')}
            </div>
        </div>
    );
});
