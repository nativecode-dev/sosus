import { CouchConfig } from '@sosus/core'
import { DocumentContext } from '@sosus/core-data'

import { Clips } from './clips/Clips'
import { Movies } from './movies/Movies'
import { Series } from './series/Series'
import { Files, FileLocations } from './files'
import { Episodes } from './series/Episodes'
import { Seasons } from './series/Seasons'

export class MediaContext extends DocumentContext<CouchConfig> {
  readonly clips: Clips = new Clips('clip', this.store)
  readonly episodes: Episodes = new Episodes('episode', this.store)
  readonly files: Files = new Files('file', this.store)
  readonly locations: FileLocations = new FileLocations('file-location', this.store)
  readonly movies: Movies = new Movies('movie', this.store)
  readonly seasons: Seasons = new Seasons('season', this.store)
  readonly series: Series = new Series('series', this.store)

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
