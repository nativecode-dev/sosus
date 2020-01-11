import { Source } from './Source'
import { MediaType } from './MediaType'
import { MediaLink } from './MediaLink'

export interface Media {
  links: MediaLink[]
  monitored: boolean
  released: Date | undefined
  runtime: number
  source: Source
  subtitle: string
  title: string
  title_sort: string
  type: MediaType
  year: number
}
