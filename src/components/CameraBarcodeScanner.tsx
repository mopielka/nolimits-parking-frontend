import React, { useEffect, useRef } from 'react'

interface Props {
  enabled: boolean
  onRead: (code: string) => void
}

const CameraBarcodeScanner: React.FC<Props> = ({ enabled, onRead }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)

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

        // Wait for the video to load before calling play()
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play()
          } catch (playError) {
            console.error('Error playing video:', playError)
          }

          const scanFrame = async () => {
            if (!enabled || stopScanning || !videoRef.current) return

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
                  stopScanning = true

                  // Pause scanning for 5 seconds
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

    startCamera()

    return () => {
      stopScanning = true
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
    }
  }, [enabled, onRead])

  return (
    <div
      style={{
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <video ref={videoRef} style={{ width: '100%' }} autoPlay />
    </div>
  )
}

export default CameraBarcodeScanner
