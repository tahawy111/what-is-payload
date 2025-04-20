import { Product } from '@/types/product'

const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000/api'

export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products?where[barcode][equals]=${barcode}`)
    const data = await response.json()

    if (data.docs && data.docs.length > 0) {
      return data.docs[0]
    }
    return null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}
