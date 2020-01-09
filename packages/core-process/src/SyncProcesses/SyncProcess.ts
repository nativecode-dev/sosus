import path from 'path'

import { SystemContext } from '@sosus/data-system'
import { CacheType, Cache } from '@sosus/core-models'
import { Fetch, Hash, Job, JobFunction, Logger, Merge, Scheduler, RequestInit, BlobBuffer } from '@sosus/core'

import { SyncConfig } from './SyncConfig'
import { SyncProcessor } from './SyncProcessor'
import { SyncSingleResult } from './SyncSingleResult'
import { SyncCollectionResult } from './SyncCollectionResult'
import { SyncableProcess } from './SyncableProcess'

export interface SyncDownloadResult {
  buffer: Buffer
  cache: Cache
  cached: boolean
}

const log = Logger.extend('sync-process')

export abstract class SyncProcess<T extends any, O extends SyncConfig> implements SyncProcessor<T, O> {
  readonly config: O
  abstract name: string

  constructor(
    config: Partial<O> = {},
    private readonly scheduler: Scheduler,
    protected readonly system: SystemContext,
  ) {
    this.config = Merge<O>([this.createConfig(), config])
    this.scheduler.on('started', (job: Job) => log.debug('start', job.name))
    this.scheduler.on('completed', (job: Job) => log.debug('complete', job.name, this.echoNext(job)))
  }

  get iterator(): AsyncGenerator<T, void, unknown> {
    return this.createIterator()
  }

  async sync(...args: any[]): Promise<SyncCollectionResult<T>> {
    log.debug('start syncing', this.config.name)

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
      log.debug('done syncing', this.config.name)
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
    const request: RequestInit = { headers: { 'user-agent': this.config.user_agent } }
    const shaid = Hash(url)
    const id = this.system.cache.keyId({ type: CacheType.http, source: { key: shaid, origin: url } })
    const exists = await this.system.cache.exists(id)
    log.trace('download-exists', { id: shaid, exists, url })

    if (exists && recache === false) {
      const attachment = await this.system.cache.getAttachment(exists._id, exists._rev, exists.content_identifier)

      if (Buffer.isBuffer(attachment)) {
        return { buffer: attachment, cache: exists, cached: true }
      } else if (attachment) {
        const buffer = await BlobBuffer(attachment)
        return { buffer, cache: exists, cached: true }
      }
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
      // tslint:disable-next-line:variable-name
      const cache = await this.system.cache.createHttpBufferCache(url, buffer, content_type)
      log.trace(cache)

      return { buffer, cache, cached: true }
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

  abstract cancel(): Promise<void>
  abstract start(): Promise<SyncableProcess>
  protected abstract createIterator(): AsyncGenerator<T, void, unknown>
  protected abstract createConfig(): Partial<O>
  protected abstract createResult(item: T, error?: Error): SyncSingleResult<T>
  protected abstract createResults(items: T[], error?: Error): SyncCollectionResult<T>
  protected abstract finalizeResults(items: T[], error?: Error): Promise<SyncCollectionResult<T>>
  protected abstract syncItem(item: T, ...args: any[]): Promise<T>
}
