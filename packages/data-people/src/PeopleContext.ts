import { DocumentContext } from '@sosus/core-data'
import { CouchConfig, injectable, scoped, Lifecycle, inject } from '@sosus/core'

import { Stars } from './stars/Stars'
import { Actors } from './actors/Actors'

export const PeopleContextConfig = Symbol('PeopleContext')

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class PeopleContext extends DocumentContext<CouchConfig> {
  readonly actors: Actors = new Actors('actor', this.store)
  readonly stars: Stars = new Stars('star', this.store)

  constructor(@inject(PeopleContextConfig) config: CouchConfig) {
    super(config)
  }

  protected async createIndexDocuments() {
    await this.store.createIndexes(this.actors.indexes.concat(this.stars.indexes))
  }
}
