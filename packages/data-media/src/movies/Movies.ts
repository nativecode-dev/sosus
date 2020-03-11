import { Documents, DocumentIndexOptions } from '@sosus/core-data'
import { MovieKeys } from '@sosus/core-models'

import { MovieDocument } from './MovieDocument'

export class Movies extends Documents<MovieDocument> {
  readonly indexes: DocumentIndexOptions[] = [
    {
      index: {
        fields: ['released'],
        name: 'movie_released',
      },
    },
    {
      index: {
        fields: ['subtitle'],
        name: 'movie_subtitle',
      },
    },
    {
      index: {
        fields: ['title'],
        name: 'movie_title',
      },
    },
  ]

  protected get keyProperties() {
    return MovieKeys
  }
}
