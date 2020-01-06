import { Slugify } from '@sosus/core'

export function createDocKey(...keys: string[]): string {
  return Slugify(keys.join('_'))
}
