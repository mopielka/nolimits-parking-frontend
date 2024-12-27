import {
  Backdrop,
  CircularProgress,
  Container,
  Snackbar,
  Typography,
} from '@mui/material'
import type { FC } from 'react'
import { useCallback, useContext, useReducer } from 'react'

import singleCarImageUrl from '../assets/single-car.png'
import { validateTicketAndGetExitTime } from '../clients/apiClient'
import LoginTokenContext from '../contexts/LoginTokenContext'

import CameraBarcodeScanner from './CameraBarcodeScanner'
import Clock from './Clock'
import ParkingForm from './ParkingForm'
import styles from './ParkingTicketPage.module.css'
import PhysicalBarcodeScanner from './PhysicalBarcodeScanner'

// Constants
const RESET_TIMEOUT = 5000
const CAMERA_SCANNER_ENABLED = Boolean(
  Number(import.meta.env.VITE_ENABLE_CAMERA_SCANNER),
)

// Types
interface AppState {
  error?: string
  ticketId: string
  exitTime?: Date
  processing: boolean
  scannerEnabled: boolean
}

enum ActionType {
  Reset,
  Submitted,
  ErrorOccurred,
  Succeeded,
  SetTicketId,
}

type Action =
  | { type: ActionType.Reset }
  | { type: ActionType.Submitted; payload: { ticketId: string } }
  | { type: ActionType.ErrorOccurred; payload: { error: string } }
  | { type: ActionType.Succeeded; payload: { exitTime: Date } }
  | { type: ActionType.SetTicketId; payload: { ticketId: string } }

// Utility functions
const formatTime = (date?: Date): string => {
  if (!date) return ''
  const pad = (num: number) => (num < 10 ? `0${num}` : num)
  return `${date.getHours()}:${pad(date.getMinutes())}`
}

const validateScannedCode = (code: string): boolean => /^[0-9]+$/.test(code)

// Components
interface SnackbarMessageProps {
  open: boolean
  message: string
  onClose: () => void
  isError?: boolean
}

const SnackbarMessage: FC<SnackbarMessageProps> = ({
  open,
  message,
  onClose,
  isError = false,
}) => (
  <Snackbar
    open={open}
    onClose={onClose}
    message={message}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    ContentProps={{
      className: `${styles.snackbarContent} ${
        isError ? styles.errorSnackbar : styles.successSnackbar
      }`,
    }}
  />
)

// Main component
const ParkingTicketPage: FC = () => {
  const initialState: AppState = {
    processing: false,
    ticketId: '',
    scannerEnabled: true,
  }

  const reducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
      case ActionType.Reset:
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
          exitTime: action.payload.exitTime,
        }
      case ActionType.SetTicketId:
        return { ...state, ticketId: action.payload.ticketId }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  const token = useContext(LoginTokenContext)

  const setTicketId = useCallback((ticketId: string) => {
    dispatch({ type: ActionType.SetTicketId, payload: { ticketId } })
  }, [])

  const handleReset = useCallback(() => {
    dispatch({ type: ActionType.Reset })
  }, [])

  const submit = useCallback(
    async (ticketId: string) => {
      dispatch({ type: ActionType.Submitted, payload: { ticketId } })
      try {
        const exitTime = await validateTicketAndGetExitTime(
          ticketId,
          token ?? '',
        )
        dispatch({ type: ActionType.Succeeded, payload: { exitTime } })
      } catch (error) {
        dispatch({
          type: ActionType.ErrorOccurred,
          payload: { error: (error as Error).message },
        })
      } finally {
        setTimeout(handleReset, RESET_TIMEOUT)
      }
    },
    [token, handleReset],
  )

  const handleBarcodeScan = useCallback(
    (code: string) => {
      if (!validateScannedCode(code)) return
      setTicketId(code)
      submit(code)
    },
    [setTicketId, submit],
  )

  return (
    <Container className={styles.pageContainer}>
      <Backdrop
        open={!!state.error || !!state.exitTime || state.processing}
        className={styles.backdropOverlay}
      >
        {state.processing && <CircularProgress />}
      </Backdrop>

      <SnackbarMessage
        open={!!state.error}
        onClose={handleReset}
        message={state.error || ''}
        isError
      />

      <SnackbarMessage
        open={!!state.exitTime}
        onClose={handleReset}
        message={`Walidacja udana, proszę wyjechać przed: ${formatTime(state.exitTime)}`}
      />

      <Clock className={styles.clockWrapper} />

      <Typography variant="h2" gutterBottom>
        Parking
      </Typography>

      <img
        src={singleCarImageUrl}
        alt="Single Car"
        className={styles.mainImage}
      />

      <Typography variant="h6" gutterBottom>
        {CAMERA_SCANNER_ENABLED
          ? 'Zeskanuj bilet lub wpisz numer '
          : 'Wpisz numer biletu '}
        aby uzyskać darmowy parking
      </Typography>

      <div className={styles.scannerFormGrid}>
        {CAMERA_SCANNER_ENABLED && (
          <div className={styles.scannerContainer}>
            <CameraBarcodeScanner
              enabled={state.scannerEnabled}
              onRead={handleBarcodeScan}
            />
          </div>
        )}
        <div className={styles.formContainer}>
          <ParkingForm
            ticketId={state.ticketId}
            setTicketId={setTicketId}
            disabled={Boolean(
              state.processing || state.error || state.exitTime,
            )}
            onSubmit={submit}
          />
        </div>
      </div>

      <PhysicalBarcodeScanner
        enabled={state.scannerEnabled}
        onRead={handleBarcodeScan}
      />
    </Container>
  )
}

export default ParkingTicketPage
