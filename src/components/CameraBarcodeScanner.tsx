import { Button } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'

// Make it always use front camera of the device if possible; if not, use any available. AI!
interface Props {
  onRead: (code: string) => void
}
const CameraBarcodeScanner: React.FC<Props> = ({ onRead }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [scannerVisible, setScannerVisible] = useState(false)

  useEffect(() => {
    if (!('BarcodeDetector' in window)) {
      console.warn('Barcode Detection API is not supported in this browser.')
      return
    }

    const barcodeDetector = new BarcodeDetector()
    let lastCode: string | null = null
    let consecutiveCount = 0
    let stopScanning = false

    const startCamera = async () => {
      if (!videoRef.current) return

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })

        videoRef.current.srcObject = stream

        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play()
          } catch (playError) {
            console.error('Error playing video:', playError)
          }

          const scanFrame = async () => {
            if (stopScanning || !videoRef.current) return

            const canvas = document.createElement('canvas')
            const video = videoRef.current

            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const context = canvas.getContext('2d')
            if (!context) return

            context.drawImage(video, 0, 0, canvas.width, canvas.height)

            try {
              const barcodes = await barcodeDetector.detect(canvas)
              if (barcodes.length > 0) {
                const currentCode = barcodes[0].rawValue

                if (currentCode === lastCode) {
                  consecutiveCount++
                } else {
                  lastCode = currentCode
                  consecutiveCount = 1
                }

                if (consecutiveCount >= 3) {
                  onRead(currentCode)
                  setScannerVisible(false) // Hide scanner immediately after successful scan
                  stopScanning = true

                  setTimeout(() => {
                    stopScanning = false
                  }, 5000)
                }
              }
            } catch (error) {
              console.error('Barcode detection failed:', error)
            }

            if (!stopScanning) {
              requestAnimationFrame(scanFrame)
            }
          }

          requestAnimationFrame(scanFrame)
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
      }
    }

    if (scannerVisible) {
      startCamera()
    }

    return () => {
      stopScanning = true
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
    }
  }, [onRead, scannerVisible])

  const handleButtonClick = () => {
    setScannerVisible(true)
    setTimeout(() => {
      setScannerVisible(false)
    }, 30_000) // Hide scanner after 1 minute
  }

  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      {!scannerVisible ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleButtonClick}
          size="large"
        >
          Kliknij aby zeskanować
        </Button>
      ) : (
        <video ref={videoRef} style={{ width: '100%' }} autoPlay />
      )}
    </div>
  )
}

export default CameraBarcodeScanner
