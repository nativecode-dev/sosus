import { SystemContext } from '@sosus/data-system'
import { Lincoln, Lifecycle, LoggerType, Throttle, inject, injectable, scoped } from '@sosus/core'

import { Command } from '../Command'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class TagMatchCommand extends Command {
  constructor(private readonly system: SystemContext, @inject(LoggerType) logger: Lincoln) {
    super('tags-match', logger)
  }

  async exec() {
    const files = await this.system.files.all({ selector: {}, limit: Number.MAX_SAFE_INTEGER })

    const tasks = files.map(file => async () => {
      if (this.cancelled) {
        return 0
      }
    })

    const results = await Throttle(tasks)
    return results.length
  }
}
