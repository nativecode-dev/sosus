import { StarAttributes } from './StarAttributes'

export interface Star {
  attributes: StarAttributes
  description: string
  image: string
  profile: string
  stage_name: string
  stage_name_normalized: string
  slug: string
  source_key: string
  source_origin: string
}

export const StarKeys = ['name']
