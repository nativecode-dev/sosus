import { Documents } from '@sosus/core-data'
import { FileLocationKeys } from '@sosus/core-models'

import { FileLocationDocument } from './FileLocationDocument'

export class FileLocations extends Documents<FileLocationDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = [
    {
      index: {
        fields: ['file_id'],
        name: 'file-location_file_id',
      },
    },
    {
      index: {
        fields: ['path'],
        name: 'file-location_path',
      },
    },
    {
      index: {
        fields: ['source.key'],
        name: 'file-location_source-key',
      },
    },
    {
      index: {
        fields: ['source.origin'],
        name: 'file-location_source-origin',
      },
    },
  ]

  protected get keyProperties() {
    return FileLocationKeys
  }
}
