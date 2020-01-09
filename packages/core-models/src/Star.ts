import { StarAttributes } from './types/StarAttributes'
import { Source, GenderType } from './types'

export interface Star {
  attributes: StarAttributes
  description: string
  image: string
  gender: GenderType
  profile: string
  stage_name: string
  stage_name_normalized: string
  slug: string
  source: Source
}

export const StarKeys = ['name']
