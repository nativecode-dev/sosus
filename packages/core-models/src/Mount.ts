import { Source } from './types/Source'
import { MountType } from './types/MountType'

export interface Mount {
  name: string
  source: Source
  type: MountType
}

export const MountKeys = ['name']
