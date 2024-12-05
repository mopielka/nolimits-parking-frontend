import {FC, useState} from 'react'

interface Props {
  onSubmit: (ticketId: string) => void
  disabled: boolean
}

const ParkingForm: FC<Props> = ({ onSubmit, disabled = false }) => {
  const [ticketId, setTicketId] = useState('')

  return (
    <div className="parking-form">
      <input
        type="text"
        placeholder="Ticket ID"
        value={ticketId}
        onChange={(event) => setTicketId(event.target.value)}
        disabled={disabled}
      />
      <button onClick={() => onSubmit(ticketId)}>Submit</button>
    </div>
  )
}

export default ParkingForm
