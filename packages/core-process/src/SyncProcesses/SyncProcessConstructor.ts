import { SyncableProcess } from './SyncableProcess'

export interface SyncProcessConstructor<T extends SyncableProcess> {
  new (...args: any[]): T
}
