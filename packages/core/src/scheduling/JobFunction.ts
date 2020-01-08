import { Job } from 'node-schedule'

export interface JobFunction {
  (job: Job): void | Promise<void>
}
