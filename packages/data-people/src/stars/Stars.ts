import { Documents } from '@sosus/core-data'

import { StarDocument } from './StarDocument'

export class Stars extends Documents<StarDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  protected get keyProperties() {
    return ['gender', 'name']
  }
}
