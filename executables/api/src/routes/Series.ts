import { Express } from 'express'
import { RouterType } from '@sosus/core-web'
import { MediaContext } from '@sosus/data-media'
import { injectable, singleton, inject } from '@sosus/core'

import { ApiRoute } from '../ApiRoute'

@injectable()
@singleton()
export class Series extends ApiRoute {
  constructor(@inject(RouterType) router: Express, private readonly media: MediaContext) {
    super('series', router)
    this.log.debug('created', this.name)
  }

  register() {
    this.registerById('episodes/:id', this.media.series)
    this.registerCollection('episodes', this.media.series)

    this.registerById('series/:id', this.media.series)
    this.registerCollection('series', this.media.series)
  }
}
