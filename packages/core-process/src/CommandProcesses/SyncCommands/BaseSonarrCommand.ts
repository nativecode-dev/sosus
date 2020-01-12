import { Lincoln } from '@sosus/core'
import { MediaContext } from '@sosus/data-media'
import { SonarrClient } from '@nativecode/sonarr'

import { CommandProcess } from '../CommandProcess'

export abstract class BaseSonarrCommand implements CommandProcess<void> {
  protected readonly log: Lincoln

  private cancelling = false

  readonly name: string

  constructor(
    name: string,
    logger: Lincoln,
    protected readonly media: MediaContext,
    protected readonly sonarr: SonarrClient,
  ) {
    this.name = name
    this.log = logger.extend(name)
    this.log.trace('created')
  }

  async cancel() {
    this.cancelling = true
  }

  protected get cancelled(): boolean {
    return this.cancelling
  }

  abstract execute(): Promise<void>
}
