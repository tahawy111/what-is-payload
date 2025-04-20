'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useBarcodeScan } from '@/hooks/useBarcodeScan'
import { getProductByBarcode } from '@/services/productService'
import { Product } from '@/types/product'
import { createInvoice } from '@/services/invoiceService'

function HomePage() {
  const { barcode, scanning, scanCount } = useBarcodeScan()
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)

  // إضافة ref لتتبع حالة المعالجة
  const isProcessing = useRef(false)
  const lastScannedBarcode = useRef<string | null>(null)

  const updateOrAddProduct = async (barcode: string) => {
    // البحث عن المنتج في القائمة
    const existingProductIndex = products.findIndex((product) => product.barcode === barcode)

    if (existingProductIndex !== -1) {
      // إذا وجد المنتج، نزيد الكمية
      console.log('تم مسح هذا المنتج مسبقاً')
      setProducts((prevProducts) => {
        const updatedProducts = [...prevProducts]
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          quantity: updatedProducts[existingProductIndex].quantity + 1,
        }
        return updatedProducts
      })
      return
    }

    if (barcode) {
      const product = await getProductByBarcode(barcode)
      console.log('مسح المنتج:', product)
      // إضافة منتج جديد
      if (product) {
        setProducts((prevProducts) => [...prevProducts, { ...product, quantity: 1 }])
      }
    }
  }

  useEffect(() => {
    if (!barcode) return

    console.log('Processing barcode:', barcode)

    const processBarcode = async () => {
      try {
        await updateOrAddProduct(barcode)
      } catch (error) {
        console.error('Error processing barcode:', error)
        setError('حدث خطأ أثناء معالجة الباركود')
      }
    }

    processBarcode()
  }, [barcode, scanCount]) // Remove scanning dependency

  const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold">قائمة المنتجات</h1>
            {scanning && <p className="text-blue-500">جاري المسح...</p>}
            {error && <p className="text-red-500">{error}</p>}
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-right">#</th>
                <th className="p-4 text-right">اسم المنتج</th>
                <th className="p-4 text-center">العدد</th>
                <th className="p-4 text-center">سعر القطعة</th>
                <th className="p-4 text-left">السعر الاجمالي</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className="border-t">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{product.title}</td>
                  <td className="p-4 text-center">{product.quantity}</td>
                  <td className="p-4 text-center">{product.price}</td>
                  <td className="p-4 text-left">{product.price * product.quantity}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={4} className="p-4 text-right font-bold">
                  الإجمالي:
                </td>
                <td className="p-4 text-left font-bold">{total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="flex gap-4 mt-4 items-center">
          <div className="mt-4">
            <button
              onClick={() => setProducts([])}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              مسح القائمة
            </button>
          </div>
          <div className="mt-4">
            <p className="text-gray-700">عدد انواع المنتجات: {products.length}</p>
          </div>
          <div className="mt-4">
            <p className="text-gray-700">الإجمالي: {total}</p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => createInvoice(products)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              إنشاء فاتورة
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HomePage
