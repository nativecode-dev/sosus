import { Express } from 'express'
import { CommandQueue } from '@sosus/core-queue'
import { CommandType, Command } from '@sosus/core-process'
import { inject, injectAll, injectable, singleton, LoggerType, Lincoln } from '@sosus/core'
import { IRoute, RouteCollectionType, RouterType, Server, LoggerMiddleware } from '@sosus/core-web'

import { ProcessorServerConfig, ProcessorServerConfigType } from './ProcessorServerConfig'

@injectable()
@singleton()
export class ProcessorServer extends Server<ProcessorServerConfig> {
  constructor(
    @inject(RouterType) express: Express,
    @inject(LoggerType) logger: Lincoln,
    @inject(ProcessorServerConfigType) config: ProcessorServerConfig,
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

    const urlize = (value: string): string => {
      return value.replace('command-', '').replace('-', '/')
    }

    this.commands.map(command => {
      express.post(`commands/${urlize(command.name)}`, (req, res) => {
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