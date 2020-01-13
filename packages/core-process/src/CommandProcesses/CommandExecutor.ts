import { injectAll, injectable, singleton, inject, LoggerType, Lincoln } from '@sosus/core'

import { CommandType } from './Command'
import { CommandInstance } from './CommandInstance'

@injectable()
@singleton()
export class CommandExecutor {
  private readonly cmdmap: Map<string, CommandInstance>
  private readonly log: Lincoln

  constructor(@inject(LoggerType) logger: Lincoln, @injectAll(CommandType) cmds: CommandInstance[]) {
    this.log = logger.extend('command-executor')
    this.cmdmap = new Map()

    cmds.forEach(cmd => this.cmdmap.set(cmd.name, cmd))
    this.log.trace('cmdmap', this.cmdmap.keys())
  }

  get commands(): CommandInstance[] {
    return Array.from(this.cmdmap.values())
  }

  command(name: string): CommandInstance | undefined {
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
