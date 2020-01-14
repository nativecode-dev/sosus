import { Lincoln } from '@sosus/core'
import { PlexClient } from '@nativecode/plex'
import { MediaContext } from '@sosus/data-media'

import { Command } from '../../Command'

export abstract class BasePlexCommand extends Command {
  constructor(
    name: string,
    logger: Lincoln,
    protected readonly media: MediaContext,
    protected readonly plex: PlexClient,
  ) {
    super(name, logger)
  }
}
