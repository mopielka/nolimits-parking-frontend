import type { FC } from 'react'

interface Props {
  onRead: (code: string) => void
  enabled: boolean
}

const PhysicalBarcodeScanner: FC<Props> = ({ onRead, enabled }) => {
  // TODO implement read from scanner

  window.simulateScan = enabled ? onRead : () => {}

  return null
}

export default PhysicalBarcodeScanner
