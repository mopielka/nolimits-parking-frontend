import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import type { FC } from 'react'
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import './ParkingForm.css'

interface Props {
  onSubmit: (ticketId: string) => void
  disabled: boolean
  ticketId: string
  setTicketId: (ticketId: string) => void
}

const ParkingForm: FC<Props> = ({
  onSubmit,
  disabled = false,
  ticketId,
  setTicketId,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (ticketId) {
      onSubmit(ticketId)
    }
  }

  const onKeyPress = (button: string) => {
    if (disabled) {
      return
    }
    if (button === '{bksp}') {
      setTicketId(ticketId.slice(0, -1))
    } else if (button === '{clear}') {
      setTicketId('')
    } else if (/^\d$/.test(button)) {
      setTicketId(ticketId + button)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="parking-form">
      <Stack spacing={2} direction="column" alignItems="center">
        <Typography variant="h4" className="ticketId">
          &nbsp;{ticketId}&nbsp;
        </Typography>
        <Keyboard
          disableButtonHold={true}
          layout={{
            default: ['1 2 3', '4 5 6', '7 8 9', '{clear} 0 {bksp}'],
          }}
          display={{
            '{bksp}': '⌫',
            '{clear}': '⟳',
          }}
          onKeyPress={onKeyPress}
          buttonTheme={[
            {
              class: 'keyboard-button',
              buttons: '1 2 3 4 5 6 7 8 9 {clear} 0 {bksp}',
            },
          ]}
          theme="keyboard"
        />
        <Button
          variant="contained"
          className="send"
          type="submit"
          disabled={disabled || !ticketId}
        >
          Wyślij
        </Button>
      </Stack>
    </form>
  )
}

export default ParkingForm
