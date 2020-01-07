import { CouchConfig } from '@sosus/core'
import { DocumentContext } from '@sosus/core-data'

import { Series } from './series/Series'

export class SeriesContext extends DocumentContext<CouchConfig> {
  readonly series: Series = new Series('series', this.store)
}
