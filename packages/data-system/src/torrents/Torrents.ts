import { Documents } from '@sosus/core-data'
import { TorrentKeys } from '@sosus/core-models'

import { TorrentDocument } from './TorrentDocument'

export class Torrents extends Documents<TorrentDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = [
    {
      index: {
        fields: ['name'],
        name: 'torrent_name',
      },
    },
  ]

  protected get keyProperties() {
    return TorrentKeys
  }
}
