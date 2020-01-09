import PouchDB from 'pouchdb'

import { CouchConfig, Logger, Merge } from '@sosus/core'

import { DocumentStore } from './DocumentStore'

const log = Logger.extend('document-context')

export abstract class DocumentContext<T extends CouchConfig> {
  protected readonly store: DocumentStore

  constructor(public readonly config: T) {
    this.store = new DocumentStore(config)
    log.debug('create-document-context', config)
  }

  get name() {
    return this.config.name
  }

  from(config: CouchConfig) {
    const remote = new PouchDB(config.name, config)
    return new Promise((resolve, reject) => {
      this.store.replicate.from(remote, {}, (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  live(config: CouchConfig): PouchDB.Replication.Sync<{}> {
    const remote = new PouchDB(config.name, config)

    const options: PouchDB.Replication.SyncOptions = {
      pull: {
        retry: true,
        live: true,
      },
      push: undefined,
    }

    log.debug('sync-live', config.name, options)

    return this.store
      .sync(remote, options)
      .on('change', change => log.trace(change))
      .on('error', error => log.error(error))
  }

  async sync(config: CouchConfig, options?: PouchDB.Replication.SyncOptions) {
    const opts = Merge([{ retry: true }, options || {}])

    return new Promise<PouchDB.Replication.SyncResultComplete<{}> | null>((resolve, reject) => {
      const remote = new PouchDB(config.name, config)
      log.debug('sync-context', config)
      this.store.sync(remote, opts, (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  to(config: CouchConfig) {
    const remote = new PouchDB(config.name, config)

    return new Promise((resolve, reject) => {
      this.store.replicate.to(remote, {}, (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  async initialize() {
    if (['http', undefined].includes(this.config.adapter)) {
      await this.store.createIndex({
        index: {
          fields: ['meta__doctype'],
          name: 'meta__doctype',
        },
      })

      await this.createIndexDocuments()
    }
  }

  protected abstract createIndexDocuments(): Promise<void>
}
