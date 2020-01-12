import { Express } from 'express'
import { CommandExecutor } from '@sosus/core-process'
import { CommandQueue, ICommand } from '@sosus/core-queue'
import { injectable, singleton, inject, Merge } from '@sosus/core'

import { ApiRoute } from '../ApiRoute'
import { RouterType } from '../Route'

@injectable()
@singleton()
export class Commands extends ApiRoute {
  constructor(
    @inject(RouterType) router: Express,
    private readonly executor: CommandExecutor,
    private readonly queue: CommandQueue,
  ) {
    super('default', router)
    this.log.debug('create', this.name)
  }

  register() {
    this.router.get('/commands', (_, res) => res.json(this.executor.commands.map(cmd => cmd.name)))

    const urlize = (value: string): string => {
      return value.replace('command-', '').replace('-', '/')
    }

    this.executor.commands.map(cmd => {
      this.router.post(`/commands/${urlize(cmd.name)}`, async (req, res) => {
        const request: ICommand = { name: cmd.name, parameters: [Merge<any>([req.params, req.query])] }
        this.log.trace('command-request', request)

        const job = await this.queue.send(request)
        this.log.trace('command-queue', job.id)

        res.json({ id: job.id, name: job.data.name })
      })
    })
  }
}
