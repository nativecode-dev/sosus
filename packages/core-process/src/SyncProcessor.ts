import { Syncable } from './Syncable'
import { SyncConfig } from './SyncConfig'
import { SyncCollectionResult } from './SyncCollectionResult'
import { SyncSingleResult } from './SyncSingleResult'

export interface SyncProcessor<T extends any, O extends SyncConfig> extends Syncable {
  readonly iterator: AsyncGenerator<T, void, unknown>
  readonly options: O

  sync(...args: any[]): Promise<SyncCollectionResult<T>>
  syncOne(item: T, ...args: any[]): Promise<SyncSingleResult<T>>
}
