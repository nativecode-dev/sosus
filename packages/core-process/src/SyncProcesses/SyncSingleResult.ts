import { SyncResult } from './SyncResult'

export interface SyncSingleResult<T> extends SyncResult {
  item: T
}
