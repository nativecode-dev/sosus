import { GenderType } from './GenderType'

export interface Actor {
  gender: GenderType
  name: string
  slug: string
}

export const ActorKeys = ['gender', 'name']
