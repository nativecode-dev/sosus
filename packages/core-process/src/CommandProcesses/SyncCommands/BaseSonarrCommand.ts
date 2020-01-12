import { Lincoln } from '@sosus/core'
import { MediaContext } from '@sosus/data-media'
import { SonarrClient } from '@nativecode/sonarr'

import { Command } from '../Command'

export abstract class BaseSonarrCommand extends Command {
  constructor(
    name: string,
    logger: Lincoln,
    protected readonly media: MediaContext,
    protected readonly sonarr: SonarrClient,
  ) {
    super(name, logger)
  }
}
