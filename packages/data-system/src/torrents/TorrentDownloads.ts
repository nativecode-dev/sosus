import { Documents } from '@sosus/core-data'

import { TorrentDownloadDocument } from './TorrentDownloadDocument'
import { TorrentDownloadKeys } from '@sosus/core-models'

export class TorrentDownloads extends Documents<TorrentDownloadDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  protected get keyProperties() {
    return TorrentDownloadKeys
  }
}
