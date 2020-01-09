import { Source } from './types'
import { TagSourceType } from './TagSourceType'

export interface Tag {
  expression: string
  name: string
  slug: string
  source: Source
  type: TagSourceType
}

export const TagKeys = ['slug']
