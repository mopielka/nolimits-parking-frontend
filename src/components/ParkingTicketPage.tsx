import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material'
import type { FC } from 'react'
import React, { useCallback, useContext, useReducer } from 'react'

import scannerImageUrl from '../assets/scanner.png'
// import singleCarImageUrl from '../assets/single-car.png'
import { validateTicket } from '../clients/apiClient'
import LoginTokenContext from '../contexts/LoginTokenContext'

import CameraBarcodeScanner from './CameraBarcodeScanner'
import Clock from './Clock'
import ParkingForm from './ParkingForm'
import PhysicalBarcodeScanner from './PhysicalBarcodeScanner'
import './ParkingTicketPage.css'
import SnackbarMessage from './SnackbarMessage'

const enableCameraScanner = Boolean(
  Number(import.meta.env.VITE_ENABLE_CAMERA_SCANNER),
)

const RESET_TIMEOUT = 5000

enum ActionType {
  Reset,
  Submitted,
  ErrorOccurred,
  Succeeded,
  SetTicketId,
  ShowForm,
}

type Action =
  | { type: ActionType.Reset }
  | { type: ActionType.Submitted; payload: { ticketId: string } }
  | { type: ActionType.ErrorOccurred; payload: { error: string } }
  | {
      type: ActionType.Succeeded
      payload: { exitTime: Date | null; remainingPayment: string | null }
    }
  | { type: ActionType.SetTicketId; payload: { ticketId: string } }
  | { type: ActionType.ShowForm }

interface AppState {
  error?: string
  ticketId: string
  exitTime?: Date
  remainingPayment?: string
  processing: boolean
  scannerEnabled: boolean
  showForm: boolean
}

const initialState: AppState = {
  processing: false,
  ticketId: '',
  scannerEnabled: true,
  showForm: false,
}

const reducer: React.Reducer<AppState, Action> = (state, action) => {
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
      return {
        ...state,
        processing: false,
        exitTime: action.payload.exitTime ?? undefined,
        remainingPayment: action.payload.remainingPayment ?? undefined,
        scannerEnabled: true,
      }
    case ActionType.SetTicketId:
      return { ...state, ticketId: action.payload.ticketId }
    case ActionType.ShowForm:
      return { ...state, showForm: true }
    default:
      return state
  }
}

const pad = (num: number) => (num < 10 ? `0${num}` : num)

const formatTime = (date?: Date) =>
  date ? `${date.getHours()}:${pad(date.getMinutes())}` : ''

const validateScannedCode = (code: string): boolean => /^[0-9]+$/.test(code)

let resetTimeout: NodeJS.Timeout
let activityTimeout: NodeJS.Timeout

const ParkingTicketPage: FC = () => {
  const [state, dispatch] = useReducer(reducer, { ...initialState })
  const token = useContext(LoginTokenContext)

  const resetManualTimeout = useCallback(() => {
    clearTimeout(activityTimeout)
    activityTimeout = setTimeout(() => {
      dispatch({ type: ActionType.Reset })
    }, 15_000)
  }, [])

  const setTicketId = useCallback(
    (ticketId: string) => {
      resetManualTimeout()
      dispatch({ type: ActionType.SetTicketId, payload: { ticketId } })
    },
    [resetManualTimeout],
  )

  const submit = useCallback(
    (ticketId: string) => {
      dispatch({ type: ActionType.Submitted, payload: { ticketId } })
      validateTicket(ticketId, token ?? '')
        .then(({ exitTime, remainingPayment }) => {
          dispatch({
            type: ActionType.Succeeded,
            payload: {
              exitTime: exitTime ?? null,
              remainingPayment: remainingPayment ?? null,
            },
          })
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
      if (state.processing || state.error) {
        return
      }
      if (!validateScannedCode(code)) {
        return
      }
      setTicketId(code)
      submit(code)
    },
    [setTicketId, submit, state.processing, state.error],
  )

  return (
    <Container className="parking-ticket-page">
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
      <SnackbarMessage
        open={!!state.remainingPayment}
        onClose={() => dispatch({ type: ActionType.Reset })}
        message={`Walidacja udana, konieczna dopłata w kasie: ${state.remainingPayment}`}
        style={{
          backgroundColor: 'orange',
          color: 'white',
        }}
      />
      <Container className="scanner-and-form-container">
        {enableCameraScanner && (
          <CameraBarcodeScanner
            onRead={onBarcodeScannerRead}
            className="camera-barcode-scanner"
          />
        )}
        {!enableCameraScanner && <div className="parking-sign">P</div>}
        {state.showForm ? (
          <ParkingForm
            ticketId={state.ticketId}
            setTicketId={setTicketId}
            disabled={Boolean(
              state.processing || state.error || state.exitTime,
            )}
            onSubmit={submit}
          />
        ) : (
          <div className="scanner-image-container">
            <Typography variant="h3">Użyj skanera →</Typography>
            <img src={scannerImageUrl} alt="Scanner" />
            <Button
              variant="contained"
              onClick={() => {
                resetManualTimeout()
                dispatch({ type: ActionType.ShowForm })
              }}
            >
              lub kliknij tutaj aby wpisać numer ręcznie
            </Button>
          </div>
        )}
      </Container>
      <PhysicalBarcodeScanner
        enabled={state.scannerEnabled}
        onRead={onBarcodeScannerRead}
      />
      <Clock />
    </Container>
  )
}

export default ParkingTicketPage
