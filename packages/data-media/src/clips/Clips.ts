import { Documents } from '@sosus/core-data'
import { ClipKeys } from '@sosus/core-models'

import { ClipDocument } from './ClipDocument'

export class Clips extends Documents<ClipDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  protected get keyProperties() {
    return ClipKeys
  }
}
