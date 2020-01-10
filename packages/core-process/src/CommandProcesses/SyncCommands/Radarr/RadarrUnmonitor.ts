import { MediaContext } from '@sosus/data-media'
import { RadarrClient } from '@nativecode/radarr'
import { Lifecycle, injectable, scoped, Throttle } from '@sosus/core'

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

    const tasks = movies
      .filter(movie => movie.hasFile)
      .map(movie => async () => {
        const profiles = await this.radarr.profile.list()

        const profile =
          profiles.find(profile => profile.id === movie.movieFile.quality.quality.id) || profiles.length > 0
            ? profiles[0]
            : undefined

        if (profile && profile.id === profile.cutoff.id) {
          movie.monitored = false
          return this.radarr.movie.update(movie)
        }

        return movie
      })

    await Throttle(tasks)
  }
}
