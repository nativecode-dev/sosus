import { Documents } from '@sosus/core-data'
import { MovieKeys } from '@sosus/core-models'

import { MovieDocument } from './MovieDocument'

export class Movies extends Documents<MovieDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  protected get keyProperties() {
    return MovieKeys
  }
}
