import { Process } from '../Process'

export interface CommandProcessConstructor<T extends Process> {
  new (...args: any[]): T
}
