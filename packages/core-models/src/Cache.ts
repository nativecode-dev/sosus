import { Source } from './types/Source'
import { Timestamp } from './types/Timestamp'
import { CacheType } from './types/CacheType'

export interface Cache {
  content_type: string
  identifier: string
  source: Source
  timestamp: Timestamp
  type: CacheType
}

export const CacheKeys = ['type', 'content_type', 'identifer']
