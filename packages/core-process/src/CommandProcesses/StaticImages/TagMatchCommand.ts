import { MediaContext } from '@sosus/data-media'
import { Lincoln, Logger, injectable, scoped, Lifecycle, Throttle } from '@sosus/core'

import { CommandProcess } from '../CommandProcess'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class TagMatchCommand implements CommandProcess<void> {
  private readonly log: Lincoln

  private cancelled = false

  readonly name: string = 'command-staticimages'

  constructor(private readonly media: MediaContext) {
    this.log = Logger.extend(this.name)
    this.log.trace('created')
  }

  async cancel() {
    this.cancelled = true
  }

  async execute() {
    const files = await this.media.files.all({ selector: {}, limit: Number.MAX_SAFE_INTEGER })

    const tasks = files.map(file => async () => {
      if (this.cancelled) {
        return
      }
    })

    await Throttle(tasks)
  }
}