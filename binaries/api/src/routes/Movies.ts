import { Express } from 'express'
import { RouterType } from '@sosus/core-web'
import { MediaContext } from '@sosus/data-media'
import { injectable, singleton, inject } from '@sosus/core'

import { ApiRoute } from '../ApiRoute'

@injectable()
@singleton()
export class Movies extends ApiRoute {
  constructor(@inject(RouterType) router: Express, private readonly media: MediaContext) {
    super('movies', router)
    this.log.debug('created', this.name)
  }

  register() {
    this.registerById('movies/:id', this.media.movies)
    this.registerCollection('movies', this.media.movies)
  }
}
