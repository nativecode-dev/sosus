import merge from 'deepmerge'

import { CouchConfig, Dedupe, Logger } from '@sosus/core'

import { createDocKey } from './index'
import { Document } from './Document'
import { BaseDocumentStore } from './DocumentStore'

export interface PropertyNames<T extends Document> {
  (document: T): string[]
}

export abstract class Documents<T extends Document> {
  abstract readonly indexes: PouchDB.Find.CreateIndexOptions[]

  protected readonly log = Logger.extend(this.type)

  constructor(public readonly type: string, private readonly store: BaseDocumentStore<T>) {}

  async all(selector?: PouchDB.Find.FindRequest<T>): Promise<T[]> {
    const required: PouchDB.Find.FindRequest<T> = {
      selector: {
        meta__doctype: this.type,
      },
      limit: Number.MAX_SAFE_INTEGER,
    }

    const query = merge.all<PouchDB.Find.FindRequest<T>>([required, selector || {}])
    return this.find(query)
  }

  bulk(updates: Partial<T>[]): Promise<(PouchDB.Core.Response | PouchDB.Core.Error)[]> {
    this.log.trace('bulk update', updates)
    this.log.debug('bulk update', updates.length)
    return this.store.bulkDocs<any>(updates)
  }

  byId(id: string): Promise<T & PouchDB.Core.RevisionIdMeta> {
    return this.store.get<T & PouchDB.Core.RevisionIdMeta>(id)
  }

  changes(): PouchDB.Core.Changes<T> {
    return this.store.changes()
  }

  async count(selector?: PouchDB.Find.FindRequest<T>): Promise<number> {
    const all = await this.all(selector)
    this.log.debug('count', all.length)
    return all.length
  }

  createDocument(document: Partial<T>): T {
    const defaults = this.empty()
    const request = this.merge(defaults as T, document)
    const id = this.keyId(request)
    return this.merge<T>(request, { _id: id } as T)
  }

  async delete(id: string, rev: string): Promise<PouchDB.Core.Response> {
    const response = await this.store.remove({ _id: id, _rev: rev })

    if (response.ok === false) {
      this.log.error(response)
      throw new Error('could not delete ${response.id}')
    }

    return response
  }

  exists(id: string) {
    return this.store.exists(id, { meta__doctype: this.type })
  }

  async find(
    selector: PouchDB.Find.FindRequest<T>,
  ): Promise<Array<T & PouchDB.Core.IdMeta & PouchDB.Core.RevisionIdMeta>> {
    const defaults: PouchDB.Find.FindRequest<T> = { selector: { meta__doctype: this.type } }
    const query = merge.all<PouchDB.Find.FindRequest<T>>([defaults, selector])
    this.log.debug('find', query)
    const results = await this.store.find(query)
    const docs = results.docs as PouchDB.Core.ExistingDocument<T>[]
    this.log.trace('find-results', results.docs.length)
    return docs
  }

  async getAttachment(id: string, rev: string, attachmentId: string) {
    try {
      const response = await this.store.getAttachment(id, attachmentId, { rev })
      this.log.trace(response)
      return response
    } catch (error) {
      this.log.error(error)
    }
  }

  async putAttachment(id: string, rev: string, attachmentId: string, type: string, buffer: Buffer) {
    try {
      const response = await this.store.putAttachment(id, attachmentId, rev, buffer, type)
      this.log.trace('create-attachment', response)
      return response
    } catch (error) {
      this.log.error(error)
    }
  }

  keyId(doc: Partial<T>): string {
    return this.createKey(doc, ...this.keyProperties)
  }

  async keys(): Promise<string[]> {
    const keys = await this.all()
    return keys.map(key => key._id)
  }

  query<Q>(fun: string | PouchDB.Map<T, Q> | PouchDB.Filter<T, Q>) {
    return this.store.query(fun)
  }

  live(config: CouchConfig) {
    const remote = new PouchDB(config.name, config)

    return this.store
      .sync(remote, { live: true, retry: true })
      .on('change', change => this.log.trace(change))
      .on('paused', info => this.log.trace('paused', info))
      .on('error', error => this.log.error(error))
  }

  async update(updates: Partial<T>): Promise<T & PouchDB.Core.IdMeta & PouchDB.Core.RevisionIdMeta> {
    const defaults = this.empty()
    const request = this.merge(defaults as T, updates)
    const id = this.keyId(request)

    const response = await this.store.upsert<T>(id, original => {
      const merged = this.merge(original, request)
      this.log.trace('merge', original, request, merged)
      return merged
    })

    this.log.trace('upsert', updates, response)
    return this.store.get(response.id)
  }

  protected createKey(document: Partial<Document>, ...properties: string[]): string {
    const type = document.meta__doctype ? document.meta__doctype : this.empty().meta__doctype!
    // TODO: Fix the cast to any
    return createDocKey(type, ...properties.map(property => (document as any)[property]))
  }

  protected empty(): Partial<Document> {
    return { meta__doctype: this.type }
  }

  protected merge<D>(...documents: Partial<D>[]): D {
    const merged = merge.all<D>(documents, {
      arrayMerge: (target, source) => Dedupe(source.concat(target)),
    })
    return merged
  }

  protected abstract get keyProperties(): string[]
}
