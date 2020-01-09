import { Source } from './types/Source'
import { Timestamp } from './types/Timestamp'
import { CacheType } from './types/CacheType'

export interface Cache {
  content: string
  content_identifier: string
  content_type: string
  encoded: boolean
  media_type: string
  source: Source
  timestamp: Timestamp
  type: CacheType
}

export const CacheKeys = ['type', 'content_type', 'content_identifier']
