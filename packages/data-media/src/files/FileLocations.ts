import { Documents } from '@sosus/core-data'
import { FileLocationKeys } from '@sosus/core-models'

import { FileLocationDocument } from './FileLocationDocument'

export class FileLocations extends Documents<FileLocationDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  protected get keyProperties() {
    return FileLocationKeys
  }
}
