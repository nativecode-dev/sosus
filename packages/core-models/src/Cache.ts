import { MimeTypeValue } from '@sosus/core'

import { Source } from './types/Source'
import { CacheType } from './types/CacheType'
import { Timestamp } from './types/Timestamp'

export interface Cache {
  content: string
  content_identifier: string
  content_type: string
  encoded: boolean
  mimetype: MimeTypeValue
  source: Source
  timestamp: Timestamp
  type: CacheType
}

export const CacheKeys = ['type', 'content_type', 'content_identifier', 'source.origin']
