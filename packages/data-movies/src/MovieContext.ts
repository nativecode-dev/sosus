import { CouchConfig } from '@sosus/core'
import { DocumentContext } from '@sosus/core-data'
import { Movies } from './movies/Movies'

export class MovieContext extends DocumentContext<CouchConfig> {
  readonly movies: Movies = new Movies('movie', this.store)
}
