import { Documents } from '@sosus/core-data'
import { StarKeys } from '@sosus/core-models'

import { StarDocument } from './StarDocument'

export class Stars extends Documents<StarDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  protected get keyProperties() {
    return StarKeys
  }
}
