import { Documents } from '@sosus/core-data'

import { ActorDocument } from './ActorDocument'
import { ActorKeys } from '@sosus/core-models'

export class Actors extends Documents<ActorDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  protected get keyProperties() {
    return ActorKeys
  }
}
