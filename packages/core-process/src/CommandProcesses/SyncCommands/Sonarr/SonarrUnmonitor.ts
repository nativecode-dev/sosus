import { MediaContext } from '@sosus/data-media'
import { SonarrClient, Series, Season, Episode } from '@nativecode/sonarr'
import { Lifecycle, Throttle, injectable, scoped, inject, LoggerType, Lincoln } from '@sosus/core'

import { BaseSonarrCommand } from '../BaseSonarrCommand'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class SonarrUnmonitor extends BaseSonarrCommand {
  constructor(media: MediaContext, sonarr: SonarrClient, @inject(LoggerType) logger: Lincoln) {
    super('command-sonarr-unmonitor', logger, media, sonarr)
    this.log.trace('created')
  }

  async execute() {
    const series = await this.sonarr.series.list()
    const tasks = series.filter(show => show.monitored === false).map(show => () => this.unmonitorSeries(show))
    await Throttle(tasks)
  }

  private async unmonitorEpisode(episode: Episode): Promise<boolean> {
    const file = await this.sonarr.files.id(episode.episodeFileId)
    return file.qualityCutoffNotMet === false
  }

  private async unmonitorSeason(series: Series, season: Season) {
    const tasks = series.seasons.map(season => async () => {
      const episodes = await this.sonarr.episodes.list(series.id)

      const seasonNumber = season.seasonNumber
      const complete = season.statistics.percentOfEpisodes === 100
      const monitored = seasonNumber > 0 && season.monitored

      if (complete && monitored) {
        const tasks = episodes
          .filter(episode => episode.seasonNumber === seasonNumber)
          .map(episode => async () => {
            const seasonMatch = episode.seasonNumber === seasonNumber
            const cutoffMet = await this.unmonitorEpisode(episode)
            return cutoffMet && seasonMatch
          })

        const result = await Throttle(tasks)
      }
    })

    await Throttle(tasks)
  }

  private async unmonitorSeries(series: Series) {
    const tasks = series.seasons.map(season => () => this.unmonitorSeason(series, season))
    await Throttle(tasks)
    await this.sonarr.series.update(series)
  }
}
