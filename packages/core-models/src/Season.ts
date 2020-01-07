import { Media } from './types/Media'
import { Episode } from './Episode'

export interface Season extends Media {
  episodes: Episode[]
  number: number
  series_slug: string
  season_slug: string
}

export const SeasonKeys = ['series_slug', 'season_slug']
