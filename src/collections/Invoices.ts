import type { CollectionConfig } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'invoiceNumber',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        const payload = await getPayload({ config })
        if (operation !== 'create') return

        // تأكد من وجود المنتجات
        if (!doc.products?.length) return

        // استخدام Promise.all لمعالجة كل المنتجات بشكل متزامن
        await Promise.all(
          doc.products.map(async (item: any) => {
            try {
              // Get product ID correctly
              const productId = typeof item.product === 'string' ? item.product : item.product.id

              if (!productId) {
                console.error('No product ID found:', item)
                return
              }

              // Try to find the product
              try {
                const {
                  docs: [product],
                } = await payload.find({
                  collection: 'products',
                  where: {
                    id: {
                      equals: productId,
                    },
                  },
                  limit: 1,
                })

                if (!product) {
                  console.error(`Product not found: ${productId}`)
                  return
                }

                // Calculate new stock
                const currentStock = Number(product.stock) || 0
                const quantity = Number(item.quantity) || 0
                const newStock = currentStock - quantity

                if (newStock < 0) {
                  console.error(`Insufficient stock for product ${productId}`)
                  return
                }

                // Update stock
                await payload.update({
                  collection: 'products',
                  id: productId,
                  data: { stock: newStock },
                })

                console.log(`Updated stock for ${productId}: ${currentStock} -> ${newStock}`)
              } catch (err) {
                console.error(`Error processing product ${productId}:`, err)
              }
            } catch (error) {
              console.error('Error in product processing:', error)
            }
          }),
        )
      },
    ],
  },
  fields: [
    {
      name: 'invoiceNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
    {
      name: 'products',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'subtotal',
          type: 'number',
          admin: {
            readOnly: true,
            hidden: false,
          },
          hooks: {
            beforeChange: [
              ({ siblingData }) => {
                // استخدام siblingData للوصول إلى بيانات نفس المنتج في المصفوفة
                const price = Number(siblingData?.price) || 0
                const quantity = Number(siblingData?.quantity) || 0
                console.log('Calculating subtotal:', { price, quantity })

                return price * quantity
              },
            ],
          },
        },
      ],
    },
    {
      name: 'totalProducts',
      type: 'number',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (!data?.products?.length) return 0
            return data.products.reduce((sum: number, item: any) => {
              return sum + (Number(item.quantity) || 0)
            }, 0)
          },
        ],
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (!data?.products?.length) return 0
            return data.products.reduce((sum: number, item: any) => {
              const price = Number(item.price) || 0
              const quantity = Number(item.quantity) || 0
              return sum + price * quantity
            }, 0)
          },
        ],
      },
    },
  ],
}
