import type { FC } from 'react'
import { useEffect, useRef } from 'react'

interface Props {
  onRead: (code: string) => void
  enabled: boolean
}

const SCANNER_TIME_TO_CLEAR = 100 // Time in milliseconds to clear the buffer if no further input
const MIN_BARCODE_LENGTH = 3

const PhysicalBarcodeScanner: FC<Props> = ({ onRead, enabled }) => {
  const buffer = useRef<string>('') // Buffer to collect barcode characters
  const timeout = useRef<NodeJS.Timeout | null>(null) // Timer for clearing buffer

  useEffect(() => {
    const clearBuffer = () => {
      if (buffer.current.length >= MIN_BARCODE_LENGTH) {
        onRead(buffer.current) // Trigger callback with the full barcode
      }
      buffer.current = '' // Clear buffer
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!enabled) return // Exit early if the scanner is disabled

      if (event.key.length === 1) {
        buffer.current += event.key // Append character to buffer

        // Reset or create the timeout to clear the buffer
        if (timeout.current) clearTimeout(timeout.current)
        timeout.current = setTimeout(clearBuffer, SCANNER_TIME_TO_CLEAR)
        return
      }

      if (event.key === 'Enter') {
        if (timeout.current) clearTimeout(timeout.current) // Clear the timeout
        clearBuffer() // Process the buffer immediately
      }
    }

    // Attach the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [enabled, onRead])

  // Simulate barcode scan for testing
  window.simulateScan = enabled ? (code: string) => onRead(code) : () => {}

  return null // No visible UI for this component
}

export default PhysicalBarcodeScanner
