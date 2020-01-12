import { injectAll, injectable, singleton, inject, LoggerType, Lincoln } from '@sosus/core'

import { CommandType, Command } from './Command'

@injectable()
@singleton()
export class CommandExecutor {
  private readonly cmdmap: Map<string, Command>
  private readonly log: Lincoln

  constructor(@inject(LoggerType) logger: Lincoln, @injectAll(CommandType) commands: Command[]) {
    this.log = logger.extend('command-executor')
    this.cmdmap = new Map()

    commands.map(cmd => this.cmdmap.set(cmd.name, cmd))

    this.log.trace('cmdmap', this.cmdmap.keys())
  }

  get commands(): Command[] {
    return Array.from(this.cmdmap.values())
  }

  command(name: string): Command | undefined {
    return this.cmdmap.get(name)
  }

  async execute(name: string, ...args: any[]): Promise<any> {
    const cmd = this.cmdmap.get(name)

    if (cmd) {
      return cmd.execute(...args)
    }

    return { name, parameters: args, found: false }
  }
}
