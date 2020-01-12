import { Express } from 'express'
import { CommandQueue } from '@sosus/core-queue'
import { CommandType, Command } from '@sosus/core-process'
import { inject, injectAll, injectable, singleton, LoggerType, Lincoln } from '@sosus/core'
import { IRoute, RouteCollectionType, RouterType, Server, LoggerMiddleware } from '@sosus/core-web'

import { SyncServerConfig, SyncServerConfigType } from './SyncServerConfig'

@injectable()
@singleton()
export class SyncServer extends Server<SyncServerConfig> {
  constructor(
    @inject(RouterType) express: Express,
    @inject(LoggerType) logger: Lincoln,
    @inject(SyncServerConfigType) config: SyncServerConfig,
    @injectAll(CommandType) private readonly commands: Command[],
    @injectAll(RouteCollectionType) private readonly routes: IRoute[],
    // tslint:disable-next-line:variable-name
    private readonly command_queue: CommandQueue,
  ) {
    super('sync-server', express, logger, config)
  }

  protected async bootstrap(express: Express) {
    express.use(LoggerMiddleware(this.log))
    this.routes.map(route => route.register())

    express.get('commands', (req, res) => res.json(this.commands.map(command => command.name)))

    this.commands.map(command => {
      express.post(`commands/${command.name}`, (req, res) => {
        const envelope = this.command_queue.createMessage(
          { name: command.name, parameters: req.query },
          this.config.machine,
        )

        this.command_queue.send(envelope)
        res.sendStatus(200)
      })
    })
  }
}
