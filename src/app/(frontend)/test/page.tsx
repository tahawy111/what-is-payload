import { getPayload } from 'payload'
import config from '@payload-config'
interface TestProps {}

export default async function Test({}: TestProps) {
  const payload = await getPayload({ config })
  const product = await payload.findByID({
    collection: 'products',
    id: '6805631b7a4b388adcea3e61',
  })
  console.log('Product:', product)
  return <div></div>
}
