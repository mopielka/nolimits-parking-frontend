import type { FC } from 'react'
import { useEffect, useState } from 'react'

import styles from './Clock.module.css'

const padTime = (part: number) => part.toString().padStart(2, '0')

const formatTime = (date: Date): string =>
  [date.getHours(), date.getMinutes(), date.getSeconds()].map(padTime).join(':')

const Clock: FC = () => {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      setTime(formatTime(new Date()))
    }

    updateTime()
    const intervalId = setInterval(updateTime, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className={styles.clock}>
      {time.split('').map((char, i) => (
        <span key={i}>{char}</span>
      ))}
    </div>
  )
}

export default Clock
