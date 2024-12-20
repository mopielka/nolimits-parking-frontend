import type { FC } from 'react'
import { useEffect, useState } from 'react'
import './Clock.css'

const padTime = (part: number) => part.toString().padStart(2, '0')

const formatTime = (date: Date): string =>
  [date.getHours(), date.getMinutes(), date.getSeconds()].map(padTime).join(':')

const Clock: FC = () => {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      setTime(formatTime(new Date()))
    }

    updateTime() // Initial call to set time immediately
    const intervalId = setInterval(updateTime, 1000)

    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [])

  return (
    <div className="clock">
      {time.split('').map((char, i) => (
        <span key={i}>{char}</span>
      ))}
    </div>
  )
}

export default Clock
