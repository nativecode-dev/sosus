import { Documents } from '@sosus/core-data'

import { TorrentDownloadDocument } from './TorrentDownloadDocument'
import { TorrentDownloadKeys } from '@sosus/core-models'

export class TorrentDownloads extends Documents<TorrentDownloadDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = [
    {
      index: {
        fields: ['status'],
        name: 'torrent-download_status',
      },
    },
    {
      index: {
        fields: ['torrent_id'],
        name: 'torrent-torrent-id',
      },
    },
  ]

  protected get keyProperties() {
    return TorrentDownloadKeys
  }
}
