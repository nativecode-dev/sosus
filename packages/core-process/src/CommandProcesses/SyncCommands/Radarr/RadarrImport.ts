import { MediaType } from '@sosus/core-models'
import { MediaContext } from '@sosus/data-media'
import { RadarrClient } from '@nativecode/radarr'
import { Lifecycle, injectable, scoped, inject, LoggerType, Lincoln } from '@sosus/core'

import { BaseRadarrCommand } from './BaseRadarrCommand'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class RadarrImport extends BaseRadarrCommand {
  constructor(media: MediaContext, radarr: RadarrClient, @inject(LoggerType) logger: Lincoln) {
    super('radarr-import', logger, media, radarr)
  }

  async exec() {
    try {
      this.log.debug('radarr-import:fetch')
      const movies = await this.radarr.movie.list()

      const documents = movies.map(movie => {
        this.log.trace('radarr-import:movie', movie.id, movie.title)

        return this.media.movies.createDocument({
          title: movie.title,
          type: MediaType.movie,
        })
      })

      const response = await this.media.movies.bulk(documents)
      this.log.trace('radarr-import:count', response.length)
      return response.length
    } catch (error) {
      return error
    }
  }
}
