import type { CollectionConfig } from 'payload'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'invoiceNumber',
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
