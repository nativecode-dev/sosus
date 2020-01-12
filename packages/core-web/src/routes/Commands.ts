import os from 'os'

import { Express } from 'express'
import { CommandQueue } from '@sosus/core-queue'
import { CommandType, Command } from '@sosus/core-process'
import { injectable, singleton, inject, injectAll } from '@sosus/core'

import { ApiRoute } from '../ApiRoute'
import { RouterType } from '../Route'

@injectable()
@singleton()
export class Commands extends ApiRoute {
  constructor(
    @inject(RouterType) router: Express,
    @injectAll(CommandType) private readonly commands: Command[],
    private readonly queue: CommandQueue,
  ) {
    super('default', router)
    this.log.debug('created', this.name)
  }

  register() {
    this.router.get('/commands', (_, res) => res.json(this.commands.map(command => command.name)))

    const urlize = (value: string): string => {
      return value.replace('command-', '').replace('-', '/')
    }

    this.commands.map(command => {
      this.router.post(`/command/${urlize(command.name)}`, async (req, res) => {
        const request = { command: command.name, parameters: req.query }
        const envelope = this.queue.createMessage({ name: command.name, parameters: request.parameters }, os.hostname())
        const id = await this.queue.send(envelope)
        this.log.trace('queue-request', envelope, id)
        res.json(request)
      })
    })
  }
}
