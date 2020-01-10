import { MediaContext } from '@sosus/data-media'
import { Lincoln, Logger, injectable, scoped, Lifecycle } from '@sosus/core'

import { CommandProcess } from '../CommandProcess'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class SonarrImportCommand implements CommandProcess<void> {
  private readonly log: Lincoln

  private cancelled = false

  readonly name: string = 'command-radarrimportcommand'

  constructor(private readonly media: MediaContext) {
    this.log = Logger.extend(this.name)
    this.log.trace('created')
  }

  async cancel() {
    this.cancelled = true
  }

  async execute() {
    return
  }
}
