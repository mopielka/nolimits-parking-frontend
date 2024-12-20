import {
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import type { FC, FormEvent } from 'react'
import { useEffect, useState } from 'react'

interface Props {
  onSubmit: (username: string, password: string) => void
  error?: string | null
  loading?: boolean
}

const LoginPage: FC<Props> = ({ onSubmit, error, loading }) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    onSubmit(username, password)
  }

  const [displayedErrorMessage, setDisplayedErrorMessage] = useState(
    error || '',
  )

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
        />
        <TextField
          name="password"
          label="Hasło"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          disabled={loading}
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
    </>
  )
}

export default LoginPage
