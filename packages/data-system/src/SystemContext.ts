import { CouchConfig } from '@sosus/core'
import { DocumentContext } from '@sosus/core-data'

import { Caches } from './cache/Caches'
import { Torrents } from './torrents/Torrents'
import { TorrentDownloads } from './torrents/TorrentDownloads'

export class SystemContext extends DocumentContext<CouchConfig> {
  readonly cache: Caches = new Caches('cache', this.store)
  readonly torrents: Torrents = new Torrents('torrent', this.store)
  readonly torrentDownloads: TorrentDownloads = new TorrentDownloads('torrent-download', this.store)

  protected async createIndexDocuments() {
    await this.store.createIndexes(
      this.cache.indexes.concat(this.torrentDownloads.indexes).concat(this.torrents.indexes),
    )
  }
}
