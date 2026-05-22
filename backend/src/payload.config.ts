import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Calculations } from './collections/Calculations'
import { Facilities } from './collections/Facilities'
import { FactorLibrary } from './collections/FactorLibrary'
import { Organizations } from './collections/Organizations'
import { SectorPacks } from './collections/SectorPacks'
import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  cors: [process.env.FRONTEND_URL || 'http://localhost:3001'].filter(Boolean),
  csrf: [process.env.FRONTEND_URL || 'http://localhost:3001'].filter(Boolean),
  admin: {
    meta: {
      titleSuffix: ' - Payload',
    },
    theme: 'light',
    user: Users.slug,
    components: {
      graphics: {
        Logo: '@/components/Logo#Logo',
        Icon: '@/components/Icon#Icon',
      },
    },
  },
  collections: [Users, Media, SectorPacks, Organizations, Facilities, FactorLibrary, Calculations],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
