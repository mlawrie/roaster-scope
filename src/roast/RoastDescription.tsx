import {connect} from 'react-redux'
import * as React from 'react'
import {RootState} from '../reducers'
import {RoastState, updateRoastTitle} from '../reducers/roastReducer'

const styles = require('./RoastDescription.scss')

interface Props {
  readonly roast: RoastState;
  readonly dispatch: (action: any) => void
}

const mapStateToProps = (state: RootState) => ({roast: state.roast})

export const RoastDescription = connect(mapStateToProps)((props: Props) => {
  const {dispatch, roast} = props

  return (
    <div className={styles.container}>
      <input className={styles.title} type="text" value={roast.title} placeholder="Roast description"
             onChange={(e) => dispatch(updateRoastTitle({title: e.target.value}))}
             />
    </div>
  )
})
