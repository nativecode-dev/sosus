import { Media } from './types/Media'
import { Season } from './Season'

export interface Series extends Media {
  seasons: Season[]
  series_slug: string
}

export const SeriesKeys = ['series_slug']
