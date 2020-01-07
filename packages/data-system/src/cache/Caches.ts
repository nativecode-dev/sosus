import { Documents } from '@sosus/core-data'

import { CacheDocument } from './CacheDocument'
import { CacheKeys } from '@sosus/core-models'

export class Caches extends Documents<CacheDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  protected get keyProperties() {
    return CacheKeys
  }
}
