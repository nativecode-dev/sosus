import { Process } from '../Process'

export interface SyncableProcess extends Process {
  start(): Promise<SyncableProcess>
}
