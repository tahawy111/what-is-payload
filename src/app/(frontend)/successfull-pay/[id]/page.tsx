'use client'
import { useParams, useRouter } from 'next/navigation'

export default function SuccessfullPay() {
  const router = useRouter()
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">تمت عملية البيع بنجاح</h1>
        <button
          onClick={() => router.push(`/print-invoice/${id}`)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          طباعة الفاتورة
        </button>
      </div>
    </div>
  )
}
