import { ObjectNavigator } from '@nofrills/types'

import { Slugify } from './Slugify'
import { DocumentKeyError } from './errors/DocumentKeyError'

const seen = new Map<any, string>()

export function CreateDocumentKey(document: any, properties: string[]): string {
  if (seen.has(document)) {
    return seen.get(document)!
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
  seen.set(document, slug)
  return slug
}
