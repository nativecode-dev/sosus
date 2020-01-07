import { MediaType } from './MediaType'

export interface Media {
  title: string
  subtitle: string
  release?: Date
  type: MediaType
}
