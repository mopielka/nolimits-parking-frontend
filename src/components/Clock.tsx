import type { FC, HTMLProps } from 'react'
import { useEffect, useState } from 'react'

import styles from './Clock.module.css'

const padTime = (part: number): string => part.toString().padStart(2, '0')

const formatTime = (date: Date): string =>
  [date.getHours(), date.getMinutes(), date.getSeconds()].map(padTime).join(':')

const Clock: FC<HTMLProps<HTMLDivElement>> = ({ className, ...divProps }) => {
  const [time, setTime] = useState<string>(formatTime(new Date()))

  useEffect(() => {
    const updateTime = () => {
      setTime(formatTime(new Date()))
    }

    // Initial call to set time immediately
    updateTime()

    // Update every second
    const intervalId = setInterval(updateTime, 1000)

    // Cleanup on unmount
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div
      className={`${styles.clockContainer} ${className || ''}`}
      {...divProps}
    >
      {time.split('').map((char, index) => (
        <span key={`${char}-${index}`} className={styles.clockDigit}>
          {char}
        </span>
      ))}
    </div>
  )
}

export default Clock
