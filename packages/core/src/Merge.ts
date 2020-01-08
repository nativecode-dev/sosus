import deepmerge from 'deepmerge'

import { Dedupe } from './Dedupe'

export function Merge<T>(objects: Partial<T>[]): T {
  return deepmerge.all<T>(objects, { arrayMerge: Dedupe })
}
