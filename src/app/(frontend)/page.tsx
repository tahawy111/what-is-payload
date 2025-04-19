'use client'

import React, { useEffect, useState } from 'react'
import BarcodeScannerComponent from 'react-qr-barcode-scanner'

export default function HomePage() {
  const [barcode, setBarcode] = useState<string>('')

  return (
    <div className="home">
      <div className="content">
        <h1>Scan a Barcode</h1>
      </div>

      <div className="scanner">
        <BarcodeScannerComponent
          width={300}
          height={200}
          onUpdate={(err, result: any) => {
            console.log('Error:', err)
            console.log('Result:', result)
            if (result?.text) {
              setBarcode(result.text) // Update the barcode state
              console.log('Scanned Barcode:', result.text)
            }
          }}
        />
        <div>
          {barcode ? <span>Scanned Barcode: {barcode}</span> : <span>No barcode scanned</span>}
        </div>
      </div>
    </div>
  )
}
