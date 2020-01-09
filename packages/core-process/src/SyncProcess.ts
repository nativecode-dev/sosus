import path from 'path'

import { CacheType } from '@sosus/core-models'
import { SystemContext } from '@sosus/data-system'
import { Fetch, Hash, Job, JobFunction, Logger, Merge, Scheduler } from '@sosus/core'

import { Syncable } from './Syncable'
import { SyncConfig } from './SyncConfig'
import { SyncProcessor } from './SyncProcessor'
import { SyncSingleResult } from './SyncSingleResult'
import { SyncCollectionResult } from './SyncCollectionResult'

export interface SyncDownloadResult {
  buffer: Buffer
  success: boolean
  type: string
}

export interface SyncProcessConstructor<T extends Syncable> {
  new (...args: any[]): T
}

const log = Logger.extend('sync-process')

export abstract class SyncProcess<T extends any, O extends SyncConfig> implements SyncProcessor<T, O> {
  readonly options: O

  constructor(
    options: Partial<O> = {},
    private readonly scheduler: Scheduler,
    protected readonly system: SystemContext,
  ) {
    this.options = Merge<O>([this.createOptions(), options])

    this.scheduler.on('started', (job: Job) => log.debug('start', job.name))
    this.scheduler.on('completed', (job: Job) => log.debug('complete', job.name, this.echoNext(job)))
  }

  get iterator(): AsyncGenerator<T, void, unknown> {
    return this.createIterator()
  }

  async sync(...args: any[]): Promise<SyncCollectionResult<T>> {
    log.debug('start syncing', this.options.name)

    try {
      const results: T[] = []

      for await (const item of this.iterator) {
        log.trace(item)
        const result = await this.syncOne(item, ...args)
        results.push(result.item)
      }

      log.trace('sync', results)
      return this.finalizeResults(results)
    } catch (error) {
      log.error(error)
      throw error
    } finally {
      log.debug('done syncing', this.options.name)
    }
  }

  async syncOne(item: T, ...args: any[]) {
    try {
      const result = await this.syncItem(item, ...args)
      log.trace('syncId', result)
      return this.createResult(result)
    } catch (error) {
      log.error(error)
      throw error
    }
  }

  private echoNext(job: Job) {
    const next = job.nextInvocation()
    return next.toISOString()
  }

  protected async download(url: string, recache: boolean = false): Promise<SyncDownloadResult> {
    const request = {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
      },
    }

    const shaid = Hash(url)
    const id = this.system.cache.keyId({ type: CacheType.http, source: { key: shaid, origin: url } })
    const exists = await this.system.cache.exists(id)
    log.trace('download-exists', { id: shaid, exists, url })

    if (exists && recache === false) {
      const cache = await this.system.cache.byId(id)
      const buffer = Buffer.from(cache.content, 'base64')
      return { buffer, success: true, type: cache.content_type }
    }

    try {
      const response = await Fetch(url, request)
      const filename = path.basename(url)

      log.trace(filename, response.status, response.statusText)

      if (response.ok === false) {
        throw new Error(`RESPONSE STATUS: ${response.status}`)
      }

      const buffer: Buffer = await response.buffer()
      log.trace(response.headers)

      // tslint:disable-next-line:variable-name
      const content_type = response.headers.get('content-type')!

      const cache = this.system.cache.createDocument({
        content: buffer.toString('base64'),
        content_identifier: filename,
        content_type,
        source: {
          key: shaid,
          origin: url,
        },
        timestamp: {
          created: new Date(),
        },
        type: CacheType.http,
      })

      const updated = await this.system.cache.update(cache)
      log.trace(updated)

      return { buffer, success: true, type: content_type }
    } catch (error) {
      log.error(error)
      throw error
    }
  }

  protected schedule(name: string, cron: string, func: JobFunction) {
    let running = false

    return this.scheduler.cron(name, cron, async (job: Job) => {
      if (running) {
        return
      }

      try {
        running = true
        await func(job)
      } catch (error) {
        log.error(error)
      } finally {
        running = false
      }
    })
  }

  abstract start(): Promise<void>
  protected abstract createIterator(): AsyncGenerator<T, void, unknown>
  protected abstract createOptions(): Partial<O>
  protected abstract createResult(item: T, error?: Error): SyncSingleResult<T>
  protected abstract createResults(items: T[], error?: Error): SyncCollectionResult<T>
  protected abstract finalizeResults(items: T[], error?: Error): Promise<SyncCollectionResult<T>>
  protected abstract syncItem(item: T, ...args: any[]): Promise<T>
}
