import { CouchConfig, Throttle } from '@sosus/core'
import { DocumentContext } from '@sosus/core-data'

import { Caches } from './cache/Caches'
import { Torrents } from './torrents/Torrents'
import { TorrentDownloads } from './torrents/TorrentDownloads'

export class SystemContext extends DocumentContext<CouchConfig> {
  readonly cache: Caches = new Caches('cache', this.store)
  readonly torrents: Torrents = new Torrents('torrent', this.store)
  readonly torrentDownloads: TorrentDownloads = new TorrentDownloads('torrent-download', this.store)

  async initialize() {
    const indexes = [
      () => this.store.createIndexes(this.cache.indexes),
      () => this.store.createIndexes(this.torrentDownloads.indexes),
      () => this.store.createIndexes(this.torrents.indexes),
    ]

    await Throttle(indexes)
  }
}
