import { MediaContext } from '@sosus/data-media'
import { RadarrClient } from '@nativecode/radarr'
import { Lifecycle, injectable, scoped } from '@sosus/core'

import { BaseRadarrCommand } from '../BaseRadarrCommand'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class RadarrUnmonitor extends BaseRadarrCommand {
  constructor(media: MediaContext, radarr: RadarrClient) {
    super('command-radarrimportcommand', media, radarr)
    this.log.trace('created')
  }

  async execute() {
    const movies = await this.radarr.movie.list()

    movies.filter(movie => movie.hasFile).map(movie => {
      movie.
    })
  }
}
