import { SyncConfig } from './SyncConfig'
import { SyncableProcess } from './SyncableProcess'
import { SyncSingleResult } from './SyncSingleResult'
import { SyncCollectionResult } from './SyncCollectionResult'

export interface SyncProcessor<T extends any, O extends SyncConfig> extends SyncableProcess {
  readonly iterator: AsyncGenerator<T, void, unknown>
  readonly config: O

  sync(...args: any[]): Promise<SyncCollectionResult<T>>
  syncOne(item: T, ...args: any[]): Promise<SyncSingleResult<T>>
}
