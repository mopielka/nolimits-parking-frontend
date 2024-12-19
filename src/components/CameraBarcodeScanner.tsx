import { BrowserMultiFormatOneDReader } from '@zxing/browser'
import React, { useEffect, useRef } from 'react'

interface Props {
  enabled: boolean
  onRead: (code: string) => void
  visible?: boolean
}

const CameraBarcodeScanner: React.FC<Props> = ({
  enabled,
  onRead,
  visible = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const codeReader = new BrowserMultiFormatOneDReader()
    let lastCode: string | null = null
    let consecutiveCount = 0
    let totalScans = 0
    const maxScans = 100
    let stop

    const startScanner = () => {
      codeReader
        .decodeFromVideoDevice(undefined, videoRef.current!, (result) => {
          if (result) {
            totalScans++
            const currentCode = result.getText()

            if (currentCode === lastCode) {
              consecutiveCount++
            } else {
              lastCode = currentCode
              consecutiveCount = 1
            }

            if (consecutiveCount >= 3) {
              onRead(currentCode)
              setTimeout(startScanner, 5000)
            } else if (totalScans >= maxScans) {
              setTimeout(startScanner, 5000)
            }
          }
        })
        .then((controls) => {
          stop = controls.stop
        })
        .catch((err) => {
          console.error(err)
        })
    }

    startScanner()

    return stop
  }, [onRead, enabled])

  return (
    <div
      style={{
        width: '80%',
        height: 'auto',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <video
        ref={videoRef}
        style={{ width: '100%', opacity: Number(visible) }}
        autoPlay
      />
    </div>
  )
}

export default CameraBarcodeScanner
