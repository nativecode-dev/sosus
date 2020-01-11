import { Router, Request, Response } from 'express'
import { injectable, singleton, inject } from '@sosus/core'

import { Route, RouterType } from '../Route'

@injectable()
@singleton()
export class Default extends Route {
  constructor(@inject(RouterType) router: Router) {
    super(router)
  }

  '/'(req: Request, res: Response) {
    res.sendStatus(200)
  }
}
