import { MediaType } from '@sosus/core-models'
import { MediaContext } from '@sosus/data-media'
import { SonarrClient, Series, Season } from '@nativecode/sonarr'
import { injectable, scoped, Lifecycle, Reduce, Throttle } from '@sosus/core'

import { BaseSonarrCommand } from '../BaseSonarrCommand'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class SonarrImport extends BaseSonarrCommand {
  constructor(media: MediaContext, sonarr: SonarrClient) {
    super('command-radarrimportcommand', media, sonarr)
    this.log.trace('created')
  }

  async execute() {
    const series = await this.sonarr.series.list()
    await this.importSeasons(Reduce(series.map(show => show.seasons)))
    await this.importSeries(series)
    await Throttle(series.map(show => () => this.importEpisodes(show)))
  }

  private async importEpisodes(series: Series) {
    const episodes = await this.sonarr.episodes.list(series.id)

    const response = await this.media.episodes.bulk(
      episodes.map(episode =>
        this.media.episodes.createDocument({
          title: episode.title,
          type: MediaType.series,
        }),
      ),
    )

    this.log.trace(response)
  }

  private async importSeasons(seasons: Season[]) {
    const response = await this.media.seasons.bulk(
      seasons.map(season =>
        this.media.seasons.createDocument({
          title: `Season ${season.seasonNumber}`,
          number: season.seasonNumber,
          type: MediaType.series,
        }),
      ),
    )

    this.log.trace(response)
  }

  private async importSeries(series: Series[]) {
    const response = await this.media.series.bulk(
      series.map(show =>
        this.media.series.createDocument({
          title: show.title,
          type: MediaType.series,
        }),
      ),
    )

    this.log.trace(response)
  }
}
