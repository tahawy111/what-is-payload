'use client'
import React, { useEffect } from 'react'
import { useBarcodeScan } from '@/hooks/useBarcodeScan'

function HomPage() {
  const { barcode, scanning } = useBarcodeScan()

  useEffect(() => {
    if (barcode) {
      console.log('Scanned barcode:', barcode)
      // Handle the barcode here
    }
  }, [barcode])

  return (
    <div className="p-4">
      <h1>Barcode Scanner</h1>
      <div className="mt-4">
        {scanning ? <p>Scanning...</p> : <p>Ready to scan</p>}
        {barcode && (
          <p className="mt-2">
            Last scanned code: <strong>{barcode}</strong>
          </p>
        )}
      </div>
    </div>
  )
}

export default HomPage
