import { DocumentContext, CouchConfig } from '@sosus/core-data'
import { injectable, scoped, Lifecycle, inject } from '@sosus/core'

import { Caches } from './cache/Caches'
import { Torrents } from './torrents/Torrents'
import { TorrentDownloads } from './torrents/TorrentDownloads'
import { Files } from './files/Files'
import { FileLocations } from './files/FileLocations'

export const SystemContextConfig = Symbol('SystemContext')

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class SystemContext extends DocumentContext<CouchConfig> {
  readonly cache: Caches = new Caches('cache', this.store)
  readonly downloads: TorrentDownloads = new TorrentDownloads('torrent-download', this.store)
  readonly files: Files = new Files('file', this.store)
  readonly locations: FileLocations = new FileLocations('file-location', this.store)
  readonly torrents: Torrents = new Torrents('torrent', this.store)

  constructor(@inject(SystemContextConfig) config: CouchConfig) {
    super(config)
  }

  protected async createIndexDocuments() {
    await this.store.createIndexes(
      this.cache.indexes
        .concat(this.downloads.indexes)
        .concat(this.files.indexes)
        .concat(this.locations.indexes)
        .concat(this.torrents.indexes),
    )
  }
}
