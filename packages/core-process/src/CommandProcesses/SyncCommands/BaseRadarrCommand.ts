import { Lincoln, Logger } from '@sosus/core'
import { MediaContext } from '@sosus/data-media'
import { RadarrClient } from '@nativecode/radarr'

import { CommandProcess } from '../CommandProcess'

export abstract class BaseRadarrCommand implements CommandProcess<void> {
  protected readonly log: Lincoln

  private cancelling = false

  readonly name: string

  constructor(name: string, protected readonly media: MediaContext, protected readonly radarr: RadarrClient) {
    this.name = name
    this.log = Logger.extend(name)
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
