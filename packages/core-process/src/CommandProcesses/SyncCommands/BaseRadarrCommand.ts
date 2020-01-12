import { Lincoln } from '@sosus/core'
import { MediaContext } from '@sosus/data-media'
import { RadarrClient } from '@nativecode/radarr'

import { Command } from '../Command'

export abstract class BaseRadarrCommand extends Command {
  constructor(
    name: string,
    logger: Lincoln,
    protected readonly media: MediaContext,
    protected readonly radarr: RadarrClient,
  ) {
    super(name, logger)
  }
}
