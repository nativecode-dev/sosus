import { Documents } from '@sosus/core-data'
import { SeasonKeys } from '@sosus/core-models'

import { SeasonDocument } from './SeasonDocument'

export class Seasons extends Documents<SeasonDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = [
    {
      index: {
        fields: ['released'],
        name: 'series_released',
      },
    },
    {
      index: {
        fields: ['subtitle'],
        name: 'series_subtitle',
      },
    },
    {
      index: {
        fields: ['title'],
        name: 'series_title',
      },
    },
  ]

  protected get keyProperties() {
    return SeasonKeys
  }
}
