import merge from 'deepmerge'

export interface Document extends PouchDB.Core.IdMeta {
  meta__doctype: string
}

export abstract class DocumentBase<T extends Document> implements Document {
  _id!: string

  // tslint:disable-next-line:variable-name
  readonly meta__doctype: string

  readonly properties: T

  constructor(type: symbol, properties?: Partial<T>) {
    this.meta__doctype = type.toString()
    this.properties = merge.all<T>([properties || {}])
  }
}
