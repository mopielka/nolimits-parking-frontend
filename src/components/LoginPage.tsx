import {
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import type { FC, FormEvent } from 'react'
import { useEffect, useState } from 'react'

import CameraBarcodeScanner from './CameraBarcodeScanner'
import PhysicalBarcodeScanner from './PhysicalBarcodeScanner'

interface Props {
  onSubmit: (username: string, password: string) => void
  error?: string | null
  loading?: boolean
}

const cameraBarcodeScannerEnabled = Boolean(
  Number(import.meta.env.VITE_ENABLE_CAMERA_SCANNER),
)

const LoginPage: FC<Props> = ({ onSubmit, error, loading }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(username, password)
  }

  const [displayedErrorMessage, setDisplayedErrorMessage] = useState(
    error || '',
  )

  const fillFromScanner = (value: string) => {
    const splitIndex = value.indexOf(':')
    if (splitIndex === -1) {
      console.error('Invalid scanned format: no colon found')
      return
    }
    const scannedUsername = value.substring(0, splitIndex)
    const scannedPassword = value.substring(splitIndex + 1)
    setUsername(scannedUsername)
    setPassword(scannedPassword)
    onSubmit(scannedUsername, scannedPassword)
  }

  useEffect(() => {
    setDisplayedErrorMessage(error ?? '')
    const t = setTimeout(() => {
      setDisplayedErrorMessage('')
    }, 3000)
    return () => clearTimeout(t)
  }, [error])

  return (
    <>
      <Typography variant="h5">No Limits parking – logowanie</Typography>
      {displayedErrorMessage && (
        <Snackbar
          open={!!displayedErrorMessage}
          autoHideDuration={6000}
          message={displayedErrorMessage}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ '& .MuiSnackbarContent-root': { backgroundColor: 'red' } }}
        />
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          name="username"
          label="Nazwa użytkownika"
          variant="outlined"
          fullWidth
          margin="normal"
          disabled={loading}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          name="password"
          label="Hasło"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Zaloguj się'}
        </Button>
      </form>
      <PhysicalBarcodeScanner
        onRead={fillFromScanner}
        enabled={!loading && !displayedErrorMessage}
      />
      <CameraBarcodeScanner
        enabled={cameraBarcodeScannerEnabled}
        onRead={fillFromScanner}
      />
    </>
  )
}

export default LoginPage
