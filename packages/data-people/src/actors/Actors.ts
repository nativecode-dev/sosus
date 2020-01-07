import { Documents } from '@sosus/core-data'

import { ActorDocument } from './ActorDocument'

export class Actors extends Documents<ActorDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  protected get keyProperties() {
    return ['gender', 'name']
  }
}
