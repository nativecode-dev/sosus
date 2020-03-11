import { Documents, DocumentIndexOptions } from '@sosus/core-data'
import { EpisodeKeys } from '@sosus/core-models'

import { EpisodeDocument } from './EpisodeDocument'

export class Episodes extends Documents<EpisodeDocument> {
  readonly indexes: DocumentIndexOptions[] = [
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
    return EpisodeKeys
  }
}
