import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import type { FC } from 'react'
import { useState } from 'react'
import Keyboard from 'react-simple-keyboard'

import 'react-simple-keyboard/build/css/index.css'
import './ParkingForm.css'
import BarcodeScanner from './BarcodeScanner'

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
  const [scannerEnabled, setScannerEnabled] = useState(true)

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
        <TextField
          label="Numer biletu"
          variant="outlined"
          value={ticketId}
          disabled
          fullWidth
        />
        <Keyboard
          disableButtonHold={true}
          layout={{
            default: ['1 2 3', '4 5 6', '7 8 9', '0 {bksp}', '{clear}'],
          }}
          display={{
            '{bksp}': '⌫',
            '{clear}': 'wyczyść',
          }}
          onKeyPress={onKeyPress}
          buttonTheme={[
            {
              class: 'keyboard-button',
              buttons: '1 2 3 4 5 6 7 8 9 0 {bksp} {clear}',
            },
          ]}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={disabled || !ticketId}
        >
          Wyślij
        </Button>
        <BarcodeScanner
          enabled={scannerEnabled}
          onRead={(code) => {
            setScannerEnabled(false)
            setTicketId(code)
            onSubmit(code)
          }}
          visible
        />
      </Stack>
    </form>
  )
}

export default ParkingForm
