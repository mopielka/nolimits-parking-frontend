import type { FC, Reducer } from 'react'
import { useReducer } from 'react'

import './App.css'
import ExitTime from './ExitTime'
import LoginWrapper from './LoginWrapper'
import ParkingForm from './ParkingForm'

enum ActionType {
  Reset,
  Submitted,
  ErrorOccurred,
  Succeeded,
}

type Action =
  | {
      type: ActionType.Reset
      payload: never
    }
  | {
      type: ActionType.Submitted
      payload: {
        ticketId: string
      }
    }
  | {
      type: ActionType.ErrorOccurred
      payload: {
        error: string
      }
    }
  | {
      type: ActionType.Succeeded
      payload: {
        exitTime: Date
      }
    }

interface AppState {
  error?: string
  ticketId: string
  exitTime?: Date
  processing: boolean
}

const initialState: AppState = {
  processing: false,
  ticketId: '',
}

const reducer: Reducer<AppState, Action> = (state, action) => {
  switch (action.type) {
    case ActionType.Reset:
      return { ...initialState }
    case ActionType.ErrorOccurred:
      return { ...state, processing: false, error: action.payload.error }
    case ActionType.Submitted:
      return { ...state, ticketId: action.payload.ticketId }
    case ActionType.Succeeded:
      return { ...state, processing: false, exitTime: action.payload.exitTime }
  }
}

const App: FC = () => {
  const [state, dispatch] = useReducer(reducer, { ...initialState })

  const setTicketId = (ticketId: string) => {
    dispatch({ type: ActionType.Submitted, payload: { ticketId } })
  }

  return (
    <LoginWrapper>
      <div className="appContainer">
        {state.error && <div className="errorMessage" />}
        <h1>Parking</h1>
        <ParkingForm onSubmit={setTicketId} disabled={state.processing} />
        {state.exitTime && <ExitTime value={state.exitTime} />}
      </div>
    </LoginWrapper>
  )
}

export default App
