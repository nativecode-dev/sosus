import { MediaType } from '@sosus/core-models'
import { MediaContext } from '@sosus/data-media'
import { RadarrClient } from '@nativecode/radarr'
import { Lifecycle, injectable, scoped, inject, LoggerType, Lincoln } from '@sosus/core'

import { BaseRadarrCommand } from '../BaseRadarrCommand'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class RadarrImport extends BaseRadarrCommand {
  constructor(media: MediaContext, radarr: RadarrClient, @inject(LoggerType) logger: Lincoln) {
    super('command-radarrimportcommand', logger, media, radarr)
    this.log.trace('created')
  }

  async execute() {
    const movies = await this.radarr.movie.list()

    const response = await this.media.movies.bulk(
      movies.map(movie =>
        this.media.movies.createDocument({
          title: movie.title,
          type: MediaType.movie,
        }),
      ),
    )

    this.log.trace(response)
  }
}
