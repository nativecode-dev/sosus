import uuid from 'uuid'

import { EventEmitter } from 'events'
import { scheduleJob, Job } from 'node-schedule'
import { injectable, scoped, Lifecycle } from 'tsyringe'

import { JobFunction } from './JobFunction'
import { JobResults } from './JobResults'

export function every(value: number) {
  return {
    hours: () => `* */${value} * * *`,
    minutes: () => `*/${value} * * * *`,
    seconds: () => `*/${value} * * * * *`,
  }
}

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class Scheduler extends EventEmitter {
  cron(id: string, cron: string, task: JobFunction): Job {
    const execute = async () => {
      try {
        this.emit('started', job)
        await Promise.resolve(task(job))
        return { success: true }
      } catch (error) {
        return { success: false, error }
      }
    }

    const job = scheduleJob(id, cron, async at => {
      const { success, error } = await execute()

      if (success) {
        const results: JobResults = {
          id,
          success,
          error: error ? error.toString() : undefined,
          next: job.nextInvocation(),
          ran_at: at,
          ran_until: new Date(),
        }

        this.emit('completed', job, results)
      }
    })

    return job
  }

  task(task: JobFunction): Job {
    const id = uuid.v4()

    const execute = async () => {
      try {
        this.emit('started', job)
        await Promise.resolve(task(job))
        return { success: true }
      } catch (error) {
        return { success: false, error }
      }
    }

    const job = scheduleJob(id, async at => {
      const { success, error } = await execute()

      if (success) {
        const results: JobResults = {
          id,
          success,
          error: error ? error.toString() : undefined,
          next: job.nextInvocation(),
          ran_at: at,
          ran_until: new Date(),
        }

        this.emit('completed', job, results)
      }
    })

    return job
  }
}
