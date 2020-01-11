import { MediaContext } from '@sosus/data-media'
import { SonarrClient, Series, Season, Episode } from '@nativecode/sonarr'
import { Lifecycle, Throttle, injectable, scoped, Reduce } from '@sosus/core'

import { BaseSonarrCommand } from '../BaseSonarrCommand'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class SonarrUnmonitor extends BaseSonarrCommand {
  constructor(media: MediaContext, sonarr: SonarrClient) {
    super('command-sonarrimportcommand', media, sonarr)
    this.log.trace('created')
  }

  async execute() {
    const series = await this.sonarr.series.list()
    const tasks = series.filter(show => show.monitored === false).map(show => () => this.unmonitorSeries(show))
    await Throttle(tasks)
  }

  private async unmonitorEpisode(episode: Episode) {
    this.sonarr.episodes
  }

  private async unmonitorSeries(series: Series) {
    const tasks = series.seasons.map(season => () => this.unmonitorSeason(series, season))
    await Throttle(tasks)
    await this.sonarr.series.update(series)
  }

  private async unmonitorSeason(series: Series, season: Season) {
    const tasks = series.seasons.map(season => async () => {
      const episodes = await this.sonarr.episodes.list(series.id)

      const seasonNumber = season.seasonNumber
      const complete = season.statistics.percentOfEpisodes === 100
      const monitored = seasonNumber > 0 && season.monitored

      if (complete && monitored) {
        const completed = episodes
          .filter(episode => episode.seasonNumber === seasonNumber)
          .every(episode => {
            const seasonMatch = episode.seasonNumber === seasonNumber
            const cutoffMet = episode.episodeFile && episode.episodeFile.qualityCutoffNotMet === false
            return cutoffMet && seasonMatch
          })

        if (completed) {
          // do update
        }
      }
    })

    await Throttle(tasks)
  }
}
