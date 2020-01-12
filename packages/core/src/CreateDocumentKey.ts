import { ObjectNavigator } from '@nofrills/types'

import { Slugify } from './Slugify'
import { DocumentKeyError } from './errors/DocumentKeyError'

const cache = new Map<string, string>()

export function CreateDocumentKey(document: any, properties: string[], caching: boolean = true): string {
  if (caching) {
    const json = JSON.stringify(document)

    if (cache.has(json)) {
      const cached = cache.get(json)

      if (cached) {
        return cached
      }
    }
  }

  const navigator = ObjectNavigator.from(document)

  const values = properties.map(property => {
    const current = navigator.get(property)

    if (current.value) {
      return current.value
    }

    throw new DocumentKeyError(document, property)
  })

  const slug = Slugify(values.join('_'))

  if (caching) {
    cache.set(document, slug)
  }

  return slug
}
