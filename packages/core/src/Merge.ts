import deepmerge from 'deepmerge'

import { Dedupe } from './Dedupe'
import { DeepPartial } from './DeepPartial'

export function Merge<T>(objects: Array<DeepPartial<T>>): T {
  const converted = objects.map<Partial<T>>(x => x as Partial<T>)
  return deepmerge.all<T>(converted, { arrayMerge: Dedupe })
}
