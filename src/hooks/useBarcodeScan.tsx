import { date } from 'node_modules/payload/dist/fields/validations'
import { useState, useEffect, useRef } from 'react'

export const useBarcodeScan = () => {
  const [barcode, setBarcode] = useState<string>('')
  const [scanning, setScanning] = useState(false)
  const [scanCount, setScanCount] = useState(0) // Add scan counter state

  // Using refs to persist values between renders
  const scannedCode = useRef<string>('')
  const lastKeyTime = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Constants
  const THRESHOLD = 20 // Time between keystrokes for barcode scanner (ms)
  const SCAN_TIMEOUT = 100 // Time to wait after last keystroke to consider scan complete (ms)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleKeyPress = (e: KeyboardEvent) => {
      const currentTime = new Date().getTime()

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Reset if time between keystrokes is too long (manual typing)
      if (currentTime - lastKeyTime.current > THRESHOLD) {
        scannedCode.current = ''
      }

      lastKeyTime.current = currentTime

      // Handle Enter key
      if (e.key === 'Enter') {
        if (scannedCode.current.length > 0) {
          console.log('Scanned barcode:', scannedCode.current)
          setBarcode(scannedCode.current)
          setScanCount((prev) => prev + 1) // Increment scan counter
          scannedCode.current = ''
          setScanning(false)
        }
        return
      }

      // Only accept numeric and alphanumeric characters
      if (/^[a-zA-Z0-9]$/.test(e.key)) {
        scannedCode.current += e.key
        setScanning(true)

        // Set timeout to finish scanning if no more keystrokes
        timeoutRef.current = setTimeout(() => {
          if (scannedCode.current.length > 0) {
            console.log('Scan timeout - collected:', scannedCode.current)
            setBarcode(scannedCode.current)
            setScanCount((prev) => prev + 1) // Increment scan counter
            scannedCode.current = ''
            setScanning(false)
          }
        }, SCAN_TIMEOUT)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { barcode, scanning, scanCount }
}
