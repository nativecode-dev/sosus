import { Documents } from '@sosus/core-data'
import { CacheKeys } from '@sosus/core-models'

import { CacheDocument } from './CacheDocument'

export class Caches extends Documents<CacheDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  protected get keyProperties() {
    return CacheKeys
  }
}
