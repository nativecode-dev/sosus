import { CouchConfig } from '@sosus/core'
import { DocumentContext } from '@sosus/core-data'

import { Caches } from './cache'
import { Torrents, TorrentDownloads } from './torrents'

export class SystemContext extends DocumentContext<CouchConfig> {
  readonly cache: Caches = new Caches('cache', this.store)
  readonly torrents: Torrents = new Torrents('torrent', this.store)
  readonly torrentDownloads: TorrentDownloads = new TorrentDownloads('torrent-download', this.store)
}
