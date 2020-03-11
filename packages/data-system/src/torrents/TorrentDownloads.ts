import { Documents, DocumentIndexOptions } from '@sosus/core-data'
import { TorrentDownloadKeys } from '@sosus/core-models'

import { TorrentDownloadDocument } from './TorrentDownloadDocument'

export class TorrentDownloads extends Documents<TorrentDownloadDocument> {
  readonly indexes: DocumentIndexOptions[] = [
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
