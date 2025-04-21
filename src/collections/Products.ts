import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title', // استخدام العنوان كعنوان في واجهة الإدارة
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'barcode',
      type: 'text',
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship', // ربط مع Categories
      relationTo: 'categories', // اسم الـ slug الخاص بـ Categories
      required: true,
    },
  ],
}
