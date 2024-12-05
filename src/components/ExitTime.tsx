import {FC} from 'react'

interface Props {
  value: Date
}

const ExitTime: FC<Props> = ({ value }) => {
  return <div>Masz czas na wyjazd do: { value.toLocaleTimeString() }</div>
}

export default ExitTime
