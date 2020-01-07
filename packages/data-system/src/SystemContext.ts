import { CouchConfig } from '@sosus/core'
import { DocumentContext } from '@sosus/core-data'

import { Caches } from './cache'

export class SystemContext extends DocumentContext<CouchConfig> {
  readonly cache: Caches = new Caches('cache', this.store)
}