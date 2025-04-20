'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  products: Array<{
    product: {
      title: string
    }
    quantity: number
    price: number
    subtotal: number
  }>
  totalAmount: number
}

export default function PrintInvoice() {
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    // Fetch invoice data
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${id}`)
        const data = await response.json()
        setInvoice(data)
      } catch (error) {
        console.error('Error fetching invoice:', error)
      }
    }

    fetchInvoice()
  }, [id])

  useEffect(() => {
    // Auto print when component mounts
    if (invoice) {
      window.print()
    }
  }, [invoice])

  if (!invoice) return <div>جاري تحميل الفاتورة...</div>

  return (
    <div className="p-4 max-w-[80mm] mx-auto bg-white">
      {/* رأس الفاتورة */}
      <div className="text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-bold">اسم المتجر</h1>
        <p className="text-sm">رقم الفاتورة: {invoice.invoiceNumber}</p>
        <p className="text-sm">التاريخ: {new Date(invoice.date).toLocaleDateString('ar-EG')}</p>
      </div>

      {/* تفاصيل المنتجات */}
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="border-b">
            <th className="text-right">المنتج</th>
            <th className="text-center">الكمية</th>
            <th className="text-left">السعر</th>
          </tr>
        </thead>
        <tbody>
          {invoice.products.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="text-right py-1">{item.product.title}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-left">{item.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* الإجمالي */}
      <div className="border-t pt-2">
        <p className="font-bold text-right">الإجمالي: {invoice.totalAmount} ريال</p>
      </div>

      {/* شكراً */}
      <div className="text-center mt-4 text-sm">
        <p>شكراً لتسوقكم معنا</p>
      </div>

      {/* أزرار التحكم - تظهر فقط على الشاشة وليس عند الطباعة */}
      <div className="print:hidden mt-8 flex justify-center gap-4">
        <button onClick={() => window.print()} className="bg-blue-500 text-white px-4 py-2 rounded">
          طباعة
        </button>
        <button
          onClick={() => router.push('/')}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          عودة
        </button>
      </div>
    </div>
  )
}
