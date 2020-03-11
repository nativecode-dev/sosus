import { Documents, DocumentIndexOptions } from '@sosus/core-data'
import { FileKeys } from '@sosus/core-models'

import { FileDocument } from './FileDocument'

export class Files extends Documents<FileDocument> {
  readonly indexes: DocumentIndexOptions[] = [
    {
      index: {
        fields: ['filename'],
        name: 'file_filename',
      },
    },
  ]

  protected get keyProperties() {
    return FileKeys
  }
}
