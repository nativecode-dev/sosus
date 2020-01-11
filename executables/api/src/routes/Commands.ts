import { Express } from 'express'
import { RouterType } from '@sosus/core-web'
import { injectable, singleton, inject } from '@sosus/core'

import { ApiRoute } from '../ApiRoute'

@injectable()
@singleton()
export class Commands extends ApiRoute {
  constructor(@inject(RouterType) router: Express) {
    super('default', router)
    this.log.debug('created', this.name)
  }

  register() {
    this.router.get('/', (_, res) => res.sendStatus(200))
  }
}
