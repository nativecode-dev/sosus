import os from 'os'

import { all, Task } from 'promise-parallel-throttle'

const CPU_COUNT = os.cpus().length

export const ProcessTimeout = (seconds: number, returns: any = undefined): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(returns), seconds * 1000)
  })
}

export function Throttle<T>(tasks: Task<T>[]): Promise<T[]> {
  return all<T>(tasks, { maxInProgress: CPU_COUNT })
}
