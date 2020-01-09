import { Documents } from '@sosus/core-data'
import { SeriesKeys } from '@sosus/core-models'

import { SeriesDocument } from './SeriesDocument'

export class Series extends Documents<SeriesDocument> {
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
    return SeriesKeys
  }
}
