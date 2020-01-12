import { Express } from 'express'
import { Route, RouterType } from '@sosus/core-web'
import { injectable, singleton, inject } from '@sosus/core'

@injectable()
@singleton()
export class Default extends Route {
  constructor(@inject(RouterType) router: Express) {
    super(router)
  }

  register() {
    this.router.get('/', (_, res) => res.sendStatus(200))
  }
}
