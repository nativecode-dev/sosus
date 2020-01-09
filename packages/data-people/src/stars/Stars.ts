import { Documents } from '@sosus/core-data'
import { StarKeys } from '@sosus/core-models'

import { StarDocument } from './StarDocument'

export class Stars extends Documents<StarDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = [
    {
      index: {
        fields: ['attributes.gender'],
        name: 'actor_attributes-gender',
      },
    },
    {
      index: {
        fields: ['stage_name'],
        name: 'actor_stage_name',
      },
    },
    {
      index: {
        fields: ['slug'],
        name: 'actor_slug',
      },
    },
    {
      index: {
        fields: ['source.key'],
        name: 'actor_source-key',
      },
    },
    {
      index: {
        fields: ['source.origin'],
        name: 'actor_source-origin',
      },
    },
  ]

  protected get keyProperties() {
    return StarKeys
  }
}
