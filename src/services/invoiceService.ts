import { Product } from '@/types/product'

const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000/api'

export async function createInvoice(products: Product[]): Promise<any | null> {
  try {
    const response = await fetch(`${API_URL}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoiceNumber: `INV-${Date.now()}`,
        date: new Date(),
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
      }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating invoice:', error)
    return null
  }
}
