import { Documents } from '@sosus/core-data'

import { CacheDocument } from './CacheDocument'

export class Caches extends Documents<CacheDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  protected get keyProperties() {
    return ['type', 'identifier']
  }
}
