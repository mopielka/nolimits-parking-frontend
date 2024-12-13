import {
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import type { FC, FormEvent } from 'react'
import { useState } from 'react'

interface Props {
  onSubmit: (username: string, password: string) => void
  error?: string | null
  loading?: boolean
}

const LoginPage: FC<Props> = ({ onSubmit, error, loading }) => {
  const [open, setOpen] = useState(!!error)

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    onSubmit(username, password)
  }

  return (
    <>
      <Typography variant="h5">No Limits parking – logowanie</Typography>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={error}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ '& .MuiSnackbarContent-root': { backgroundColor: 'red' } }}
      />
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
