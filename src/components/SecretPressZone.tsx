import type { FC, ReactNode } from 'react'
import { useEffect, useState } from 'react'

interface SecretPressZoneProps {
  onPress: () => void
  secondsToActivate?: number
  children: ReactNode
}

const SecretPressZone: FC<SecretPressZoneProps> = ({
  onPress,
  children,
  secondsToActivate = 5,
}) => {
  const [pressTimer, setPressTimer] = useState<number | null>(null)

  useEffect(() => {
    const handlePressStart = (e: MouseEvent | TouchEvent) => {
      if (
        e instanceof MouseEvent &&
        e.clientX < window.innerWidth * 0.2 &&
        e.clientY < window.innerHeight * 0.2
      ) {
        setPressTimer(
          window.setTimeout(() => {
            onPress()
          }, 5000),
        )
      } else if (
        e instanceof TouchEvent &&
        e.touches[0].clientX < window.innerWidth * 0.2 &&
        e.touches[0].clientY < window.innerHeight * 0.2
      ) {
        setPressTimer(
          window.setTimeout(() => {
            onPress()
          }, secondsToActivate * 1000),
        )
      }
    }

    const handlePressEnd = () => {
      if (pressTimer) {
        clearTimeout(pressTimer)
        setPressTimer(null)
      }
    }

    window.addEventListener('mousedown', handlePressStart)
    window.addEventListener('touchstart', handlePressStart)
    window.addEventListener('mouseup', handlePressEnd)
    window.addEventListener('touchend', handlePressEnd)

    return () => {
      window.removeEventListener('mousedown', handlePressStart)
      window.removeEventListener('touchstart', handlePressStart)
      window.removeEventListener('mouseup', handlePressEnd)
      window.removeEventListener('touchend', handlePressEnd)
    }
  }, [pressTimer, onPress, secondsToActivate])

  return <>{children}</>
}

export default SecretPressZone
