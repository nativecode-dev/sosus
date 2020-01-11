import { Router, Request, Response } from 'express'
import { injectable, singleton, inject } from '@sosus/core'

import { Route, RouterType } from '../Route'

@injectable()
@singleton()
export class Media extends Route {
  constructor(@inject(RouterType) router: Router) {
    super(router)
  }

  '/media'(req: Request, res: Response) {
    res.sendStatus(200)
  }
}
