import { useState, useEffect } from 'react'

export const useBarcodeScan = () => {
  const [barcode, setBarcode] = useState<string>('')
  const [scanning, setScanning] = useState(false)

  let scannedCode = ''
  let lastKeyTime = 0
  const THRESHOLD = 20 // Time threshold between keystrokes in milliseconds

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleKeyPress = (e: KeyboardEvent) => {
      const currentTime = new Date().getTime()

      // If the time between keystrokes is greater than threshold, reset the scanned code
      if (currentTime - lastKeyTime > THRESHOLD) {
        scannedCode = ''
      }

      // Update the last key time
      lastKeyTime = currentTime

      // If it's Enter key, process the scanned code
      if (e.key === 'Enter') {
        setBarcode(scannedCode)
        scannedCode = ''
        setScanning(false)
        return
      }

      // Accumulate the scanned characters
      scannedCode += e.key
      setScanning(true)
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return { barcode, scanning }
}
