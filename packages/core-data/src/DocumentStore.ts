import merge from 'deepmerge'
import PouchDB from 'pouchdb'

import { Logger, Throttle, injectable, scoped, Lifecycle } from '@sosus/core'

export abstract class BaseDocumentStore<T> extends PouchDB<T> {
  private readonly log = Logger.extend('base-document-store')

  constructor(options: PouchDB.Configuration.DatabaseConfiguration) {
    super(options.name, options)
    this.log.trace('ctor', options)
  }

  createIndexes(indexes: PouchDB.Find.CreateIndexOptions[]) {
    const tasks = indexes.map(index => () => this.createIndex(index))
    return Throttle(tasks)
  }

  async exists(id: string, selector?: PouchDB.Find.Selector): Promise<boolean> {
    const defaults: Partial<PouchDB.Find.FindRequest<T>> = { selector: { _id: { $eq: id } } }
    const overrides = selector ? { selector } : {}
    const query = merge.all<PouchDB.Find.FindRequest<T>>([defaults, overrides])
    const keys = await this.find(query)
    return keys.docs.map(doc => doc._id).some(_id => _id.toLowerCase() === id.toLowerCase())
  }
}

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class DocumentStore extends BaseDocumentStore<any> {
  constructor(options: PouchDB.Configuration.DatabaseConfiguration) {
    super(options)
  }
}
