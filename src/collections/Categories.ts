import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name', // استخدام الاسم كعنوان في واجهة الإدارة
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true, // اسم التصنيف مطلوب
    },
    {
      name: 'description',
      type: 'textarea', // وصف التصنيف
    },
  ],
}
