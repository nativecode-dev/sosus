import { Documents, DocumentIndexOptions } from '@sosus/core-data'

import { ActorDocument } from './ActorDocument'
import { ActorKeys } from '@sosus/core-models'

export class Actors extends Documents<ActorDocument> {
  readonly indexes: DocumentIndexOptions[] = [
    {
      index: {
        fields: ['gender'],
        name: 'actor_gender',
      },
    },
    {
      index: {
        fields: ['name'],
        name: 'actor_name',
      },
    },
    {
      index: {
        fields: ['slug'],
        name: 'actor_slug',
      },
    },
  ]

  protected get keyProperties() {
    return ActorKeys
  }
}
