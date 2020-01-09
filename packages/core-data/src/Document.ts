import { DeepPartial, Merge } from '@sosus/core'

export interface Document extends PouchDB.Core.IdMeta, PouchDB.Core.RevisionIdMeta {
  meta__doctype: string
}

export abstract class DocumentBase<T extends Document> implements Document {
  _id!: string
  _rev!: string

  // tslint:disable-next-line:variable-name
  readonly meta__doctype: string

  readonly properties: T

  constructor(type: symbol, properties?: DeepPartial<T>) {
    this.meta__doctype = type.toString()
    this.properties = Merge<T>([properties || {}])
  }
}
