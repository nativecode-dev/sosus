import { CouchConfig, Throttle } from '@sosus/core'
import { DocumentContext } from '@sosus/core-data'

import { Actors } from './actors/Actors'
import { Stars } from './stars/Stars'

export class PeopleContext extends DocumentContext<CouchConfig> {
  readonly actors: Actors = new Actors('actor', this.store)
  readonly stars: Stars = new Stars('star', this.store)

  async initialize() {
    const indexes = [
      () => this.store.createIndexes(this.actors.indexes),
      () => this.store.createIndexes(this.stars.indexes),
    ]

    await Throttle(indexes)
  }
}
