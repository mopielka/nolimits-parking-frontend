import {
  Backdrop,
  CircularProgress,
  Container,
  Snackbar,
  Typography,
} from '@mui/material'
import type { FC, Reducer } from 'react'
import { useContext, useReducer } from 'react'

import { validateTicketAndGetExitTime } from '../clients/apiClient'
import LoginTokenContext from '../contexts/LoginTokenContext'

import ParkingForm from './ParkingForm'

const RESET_TIMEOUT = 5000

enum ActionType {
  Reset,
  Submitted,
  ErrorOccurred,
  Succeeded,
  SetTicketId,
}

type Action =
  | {
      type: ActionType.Reset
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
  | {
      type: ActionType.SetTicketId
      payload: { ticketId: string }
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
      clearTimeout(resetTimeout)
      return { ...initialState }
    case ActionType.ErrorOccurred:
      return { ...state, processing: false, error: action.payload.error }
    case ActionType.Submitted:
      return { ...state, ticketId: action.payload.ticketId, processing: true }
    case ActionType.Succeeded:
      return { ...state, processing: false, exitTime: action.payload.exitTime }
    case ActionType.SetTicketId:
      return { ...state, ticketId: action.payload.ticketId }
  }
}

const pad = (num: number) => (num < 10 ? `0${num}` : num)

const formatTime = (date?: Date) =>
  date ? `${date.getHours()}:${pad(date.getMinutes())}` : ''

const SnackbarMessage = ({
  open,
  message,
  onClose,
  style,
}: {
  open: boolean
  message: string
  onClose: () => void
  style: React.CSSProperties
}) => (
  <Snackbar
    open={open}
    onClose={onClose}
    message={message}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    ContentProps={{
      style: {
        ...style,
        fontSize: '1.2rem',
      },
    }}
  />
)

let resetTimeout: NodeJS.Timeout

const ParkingTicketPage: FC = () => {
  const [state, dispatch] = useReducer(reducer, { ...initialState })
  const token = useContext(LoginTokenContext)

  const setTicketId = (ticketId: string) => {
    dispatch({ type: ActionType.SetTicketId, payload: { ticketId } })
  }

  const submit = (ticketId: string) => {
    dispatch({ type: ActionType.Submitted, payload: { ticketId } })
    validateTicketAndGetExitTime(ticketId, token ?? '')
      .then((exitTime) => {
        dispatch({ type: ActionType.Succeeded, payload: { exitTime } })
      })
      .catch((error) => {
        dispatch({
          type: ActionType.ErrorOccurred,
          payload: { error: (error as Error).message },
        })
      })
      .finally(() => {
        resetTimeout = setTimeout(() => {
          dispatch({ type: ActionType.Reset })
        }, RESET_TIMEOUT)
      })
  }

  return (
    <Container maxWidth="sm">
      <Backdrop
        open={!!state.error || !!state.exitTime || state.processing}
        style={{
          zIndex: 1300,
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {state.processing && <CircularProgress />}
      </Backdrop>
      <SnackbarMessage
        open={!!state.error}
        onClose={() => dispatch({ type: ActionType.Reset })}
        message={state.error || ''}
        style={{
          backgroundColor: 'red',
          color: 'white',
        }}
      />
      <SnackbarMessage
        open={!!state.exitTime}
        onClose={() => dispatch({ type: ActionType.Reset })}
        message={`Walidacja udana, proszę wyjechać przed: ${formatTime(state.exitTime)}`}
        style={{
          backgroundColor: 'green',
          color: 'white',
        }}
      />
      <Typography variant="h4" gutterBottom>
        Parking
      </Typography>
      <Typography variant="body1" gutterBottom>
        Zeskanuj bilet lub wpisz numer aby uzyskać darmowy parking
      </Typography>
      <ParkingForm
        ticketId={state.ticketId}
        setTicketId={setTicketId}
        disabled={Boolean(state.processing || state.error || state.exitTime)}
        onSubmit={submit}
      />
    </Container>
  )
}

export default ParkingTicketPage
