import { Documents } from '@sosus/core-data'

import { TorrentDocument } from './TorrentDocument'
import { TorrentKeys } from '@sosus/core-models'

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
