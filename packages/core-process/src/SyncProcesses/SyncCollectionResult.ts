import { SyncResult } from './SyncResult'

export interface SyncCollectionResult<T> extends SyncResult {
  items: T[]
}
