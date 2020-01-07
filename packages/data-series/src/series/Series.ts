import { Documents } from '@sosus/core-data'
import { SeriesKeys } from '@sosus/core-models'

import { SeriesDocument } from './SeriesDocument'

export class Series extends Documents<SeriesDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  protected get keyProperties() {
    return SeriesKeys
  }
}
