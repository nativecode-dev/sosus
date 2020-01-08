import { CouchConfig, Throttle } from '@sosus/core'
import { DocumentContext } from '@sosus/core-data'

import { Clips } from './clips/Clips'
import { Movies } from './movies/Movies'
import { Series } from './series/Series'
import { Files, FileLocations } from './files'

export class MediaContext extends DocumentContext<CouchConfig> {
  readonly clips: Clips = new Clips('clip', this.store)
  readonly files: Files = new Files('file', this.store)
  readonly locations: FileLocations = new FileLocations('file-location', this.store)
  readonly movies: Movies = new Movies('movie', this.store)
  readonly series: Series = new Series('series', this.store)

  async initialize() {
    const indexes = [
      () => this.store.createIndexes(this.clips.indexes),
      () => this.store.createIndexes(this.files.indexes),
      () => this.store.createIndexes(this.locations.indexes),
      () => this.store.createIndexes(this.movies.indexes),
      () => this.store.createIndexes(this.series.indexes),
    ]

    await Throttle(indexes)
  }
}
