import { Documents } from '@sosus/core-data'
import { ClipKeys } from '@sosus/core-models'

import { ClipDocument } from './ClipDocument'

export class Clips extends Documents<ClipDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = [
    {
      index: {
        fields: ['released'],
        name: 'clip_released',
      },
    },
    {
      index: {
        fields: ['subtitle'],
        name: 'clip_subtitle',
      },
    },
    {
      index: {
        fields: ['title'],
        name: 'clip_title',
      },
    },
    {
      index: {
        fields: ['type'],
        name: 'clip_type',
      },
    },
  ]

  protected get keyProperties() {
    return ClipKeys
  }
}
