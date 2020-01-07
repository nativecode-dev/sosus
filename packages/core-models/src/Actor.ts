import { GenderType } from './types/GenderType'

export interface Actor {
  gender: GenderType
  name: string
  slug: string
}

export const ActorKeys = ['gender', 'name']
