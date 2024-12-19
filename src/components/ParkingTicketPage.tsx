import {
  Backdrop,
  CircularProgress,
  Container,
  Snackbar,
  Typography,
} from '@mui/material'
import type { FC, Reducer } from 'react'
import { useCallback, useContext, useReducer } from 'react'

import singleCarImageUrl from '../assets/single-car.png'
import { validateTicketAndGetExitTime } from '../clients/apiClient'
import LoginTokenContext from '../contexts/LoginTokenContext'

import ParkingForm from './ParkingForm'
import PhysicalBarcodeScanner from './PhysicalBarcodeScanner'
import './ParkingTicketPage.css'

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
  scannerEnabled: boolean
}

const initialState: AppState = {
  processing: false,
  ticketId: '',
  scannerEnabled: true,
}

const reducer: Reducer<AppState, Action> = (state, action) => {
  switch (action.type) {
    case ActionType.Reset:
      clearTimeout(resetTimeout)
      return { ...initialState }
    case ActionType.ErrorOccurred:
      return { ...state, processing: false, error: action.payload.error }
    case ActionType.Submitted:
      return {
        ...state,
        ticketId: action.payload.ticketId,
        processing: true,
        scannerEnabled: false,
      }
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
        fontSize: '2rem',
        margin: 'auto',
        textAlign: 'center',
      },
    }}
  />
)

let resetTimeout: NodeJS.Timeout

const ParkingTicketPage: FC = () => {
  const [state, dispatch] = useReducer(reducer, { ...initialState })
  const token = useContext(LoginTokenContext)

  const setTicketId = useCallback((ticketId: string) => {
    dispatch({ type: ActionType.SetTicketId, payload: { ticketId } })
  }, [])

  const submit = useCallback(
    (ticketId: string) => {
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
    },
    [token],
  )

  const onBarcodeScannerRead = useCallback(
    (code: string) => {
      setTicketId(code)
      submit(code)
    },
    [setTicketId, submit],
  )

  return (
    <Container className="container">
      <Backdrop
        open={!!state.error || !!state.exitTime || state.processing}
        className="backdrop"
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
      <Typography variant="h2" gutterBottom>
        Parking
      </Typography>
      <img src={singleCarImageUrl} />
      <Typography variant="h6" gutterBottom>
        Zeskanuj bilet lub wpisz numer aby uzyskać darmowy parking
      </Typography>
      <ParkingForm
        ticketId={state.ticketId}
        setTicketId={setTicketId}
        disabled={Boolean(state.processing || state.error || state.exitTime)}
        onSubmit={submit}
      />
      {/*<CameraBarcodeScanner*/}
      {/*  enabled={false} // state.scannerEnabled*/}
      {/*  onRead={onBarcodeScannerRead}*/}
      {/*  visible*/}
      {/*/>*/}
      <PhysicalBarcodeScanner
        enabled={state.scannerEnabled}
        onRead={onBarcodeScannerRead}
      />
    </Container>
  )
}

export default ParkingTicketPage
