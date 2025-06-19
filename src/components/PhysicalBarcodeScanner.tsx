import type { FC } from 'react'
import { useEffect, useRef } from 'react'

interface Props {
  onRead: (code: string) => void
  enabled: boolean
}

const SCANNER_TIME_TO_CLEAR = 100 // Time in milliseconds to clear the buffer if no further input
const MIN_BARCODE_LENGTH = 3

const PhysicalBarcodeScanner: FC<Props> = ({ onRead, enabled }) => {
  const buffer = useRef<string>('')
  const timeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const clearBuffer = () => {
      if (buffer.current.length >= MIN_BARCODE_LENGTH) {
        onRead(buffer.current)
      }
      buffer.current = ''
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!enabled) return

      if (event.key.length === 1) {
        buffer.current += event.key

        if (timeout.current) clearTimeout(timeout.current)
        timeout.current = setTimeout(clearBuffer, SCANNER_TIME_TO_CLEAR)
        return
      }

      if (event.key === 'Enter') {
        if (timeout.current) clearTimeout(timeout.current)
        clearBuffer()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [enabled, onRead])

  window.simulateScan = enabled ? (code: string) => onRead(code) : () => {}

  return null
}

export default PhysicalBarcodeScanner
