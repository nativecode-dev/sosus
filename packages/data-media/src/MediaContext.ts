import { DocumentContext } from '@sosus/core-data'
import { CouchConfig, injectable, scoped, Lifecycle, inject } from '@sosus/core'

import { Files } from './files/Files'
import { Clips } from './clips/Clips'
import { Movies } from './movies/Movies'
import { Series } from './series/Series'
import { Seasons } from './series/Seasons'
import { Episodes } from './series/Episodes'
import { FileLocations } from './files/FileLocations'

export const MediaContextConfig = Symbol('MediaContext')

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class MediaContext extends DocumentContext<CouchConfig> {
  readonly clips: Clips = new Clips('clip', this.store)
  readonly episodes: Episodes = new Episodes('episode', this.store)
  readonly files: Files = new Files('file', this.store)
  readonly locations: FileLocations = new FileLocations('file-location', this.store)
  readonly movies: Movies = new Movies('movie', this.store)
  readonly seasons: Seasons = new Seasons('season', this.store)
  readonly series: Series = new Series('series', this.store)

  constructor(@inject(MediaContextConfig) config: CouchConfig) {
    super(config)
  }

  protected async createIndexDocuments() {
    await this.store.createIndexes(
      this.clips.indexes
        .concat(this.episodes.indexes)
        .concat(this.files.indexes)
        .concat(this.locations.indexes)
        .concat(this.movies.indexes)
        .concat(this.seasons.indexes)
        .concat(this.series.indexes),
    )
  }
}
