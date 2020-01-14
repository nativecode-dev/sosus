import { MediaContext } from '@sosus/data-media'
import { PlexClient } from '@nativecode/plex'
import { Lifecycle, injectable, scoped, inject, LoggerType, Lincoln } from '@sosus/core'

import { BasePlexCommand } from './BasePlexCommand'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class PlexImport extends BasePlexCommand {
  constructor(media: MediaContext, plex: PlexClient, @inject(LoggerType) logger: Lincoln) {
    super('plex-import', logger, media, plex)
  }

  async exec() {
    return Promise.resolve()
  }
}
