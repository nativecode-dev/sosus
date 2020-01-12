import { Express } from 'express'
import { RouterType } from '@sosus/core-web'
import { CommandType, Command } from '@sosus/core-process'
import { injectable, singleton, inject, injectAll } from '@sosus/core'

import { ApiRoute } from '../ApiRoute'

@injectable()
@singleton()
export class Commands extends ApiRoute {
  constructor(@inject(RouterType) router: Express, @injectAll(CommandType) private readonly commands: Command[]) {
    super('default', router)
    this.log.debug('created', this.name)
  }

  register() {
    this.router.get('/commands', (_, res) => res.json(this.commands.map(command => command.name)))

    this.commands.map(command => {
      this.router.get(`/command/${command.name}`, (req, res) => {
        const { parameters } = req.params
        res.json({ command, parameters })
      })
    })
  }
}
