// src/app/admin/[[...index]]/page.tsx
'use client'

import {NextStudio} from 'next-sanity/studio'
import config from '../../../../sanity.config' // caminho relativo até o arquivo da RAIZ

export default function AdminPage() {
  return <NextStudio config={config} />
}
