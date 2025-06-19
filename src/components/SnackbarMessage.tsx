import { Snackbar } from '@mui/material'
import type { FC } from 'react'

interface SnackbarMessageProps {
  open: boolean
  message: string
  onClose: () => void
  style: React.CSSProperties
}

const SnackbarMessage: FC<SnackbarMessageProps> = ({
  open,
  message,
  onClose,
  style,
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
        marginTop: '45vh',
        textAlign: 'center',
      },
    }}
  />
)

export default SnackbarMessage
