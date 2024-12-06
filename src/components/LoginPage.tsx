import { Alert, Button, CircularProgress, TextField } from '@mui/material'
import type { FC, FormEvent } from 'react'

interface Props {
  onSubmit: (username: string, password: string) => void
  error?: string | null
  loading?: boolean
}

const LoginPage: FC<Props> = ({ onSubmit, error, loading }) => {
  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    onSubmit(username, password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="username"
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        disabled={loading}
      />
      <TextField
        name="password"
        label="Password"
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
        {loading ? <CircularProgress size={24} /> : 'Submit'}
      </Button>
    </form>
  )
}

export default LoginPage
