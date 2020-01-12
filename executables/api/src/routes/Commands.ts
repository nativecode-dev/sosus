import { Express } from 'express'
import { RouterType } from '@sosus/core-web'
import { injectable, singleton, inject, injectAll } from '@sosus/core'

import { ApiRoute } from '../ApiRoute'
import { CommandProcessType, CommandProcess } from '@sosus/core-process/src'

@injectable()
@singleton()
export class Commands extends ApiRoute {
  constructor(
    @inject(RouterType) router: Express,
    @injectAll(CommandProcessType) private readonly commands: CommandProcess<any>[],
  ) {
    super('default', router)
    this.log.debug('created', this.name)
  }

  register() {
    this.router.get('/commands', (_, res) => res.json(this.commands.map(command => command.name)))
  }
}
