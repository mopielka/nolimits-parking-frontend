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
    if (!('BarcodeDetector' in window)) {
      console.warn('Barcode Detection API is not supported in this browser.')
      return
    }

    let lastCode: string | null = null
    let consecutiveCount = 0
    let stopScanning = false

    const barcodeDetector = new BarcodeDetector()
    const maxScans = 100
    let totalScans = 0

    const startScanner = async () => {
      if (!videoRef.current) return

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        videoRef.current.srcObject = stream
        void videoRef.current.play()

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
                stopScanning = true // Pause scanning for 5 seconds
                setTimeout(() => {
                  stopScanning = false
                  totalScans = 0
                  startScanner()
                }, 5000)
                return
              }
            }
          } catch (error) {
            console.error('Barcode detection failed:', error)
          }

          totalScans++
          if (totalScans < maxScans) {
            requestAnimationFrame(scanFrame)
          } else {
            // Reset scanning after maxScans
            stopScanning = true
            setTimeout(() => {
              stopScanning = false
              totalScans = 0
              startScanner()
            }, 5000)
          }
        }

        requestAnimationFrame(scanFrame)
      } catch (error) {
        console.error('Error accessing camera:', error)
      }
    }

    void startScanner()

    return () => {
      stopScanning = true
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
    }
  }, [onRead, enabled])

  return (
    <div
      style={{
        width: '0%',
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
