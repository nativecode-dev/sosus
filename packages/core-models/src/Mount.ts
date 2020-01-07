import { Source } from './Source'
import { MountType } from './MountType'

export interface Mount {
  name: string
  source: Source
  type: MountType
}
