import {Action} from 'redux'

interface ActionCreator<T> {
  readonly type: string

  (payload: T): Action<T>
}

interface CreatedAction<T> {
  readonly type: string
  readonly payload: T
}

export const isAction = <T>(action: Action<any>, actionCreator: ActionCreator<T>):
  action is CreatedAction<T> => action.type === actionCreator.type

export const actionCreator = <T>(type: string): ActionCreator<T> =>
  Object.assign((payload: T): any => ({type, payload}), {type})
