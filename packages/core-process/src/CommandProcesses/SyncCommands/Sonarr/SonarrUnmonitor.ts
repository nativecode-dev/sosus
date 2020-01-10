import { MediaContext } from '@sosus/data-media'
import { SonarrClient, Series, Season } from '@nativecode/sonarr'
import { Lifecycle, injectable, scoped, Throttle, Reduce } from '@sosus/core'

import { BaseSonarrCommand } from '../BaseSonarrCommand'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class SonarrUnmonitor extends BaseSonarrCommand {
  constructor(media: MediaContext, sonarr: SonarrClient) {
    super('command-sonarrimportcommand', media, sonarr)
    this.log.trace('created')
  }

  async execute() {
    const series = await this.sonarr.shows.list()
    await Throttle(series.map(show => () => this.unmonitor(show)))
  }

  private async unmonitor(series: Series) {
    series.seasons = series.seasons.map(season => {
      if (season.statistics.percentOfEpisodes === 100) {
        season.monitored = false
      }
      return season
    })

    this.sonarr.shows.update(series)
  }
}
