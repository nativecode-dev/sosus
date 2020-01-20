import { Source } from './types/Source'
import { MountType } from './types/MountType'

export interface Mount {
  mount_host: string
  mount_path: string
  name: string
  source: Source
  type: MountType
}

export const MountKeys = ['name']
