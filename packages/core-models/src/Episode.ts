import { Media } from './types/Media'

export interface Episode extends Media {
  number: number
  season_slug: string
  series_slug: string
  episode_slug: string
}

export const EpisodeKeys = ['series_slug', 'season_slug', 'episode_slug']
