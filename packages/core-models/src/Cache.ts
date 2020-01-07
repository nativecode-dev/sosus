import { Source } from './Source'
import { Timestamp } from './Timestamp'

export enum CacheType {
  http = 'http',
}

export interface Cache {
  identifier: string
  source: Source
  timestamp: Timestamp
  type: CacheType
}
