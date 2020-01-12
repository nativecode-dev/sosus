import { ObjectNavigator } from '@nofrills/types'

import { Slugify } from './Slugify'
import { DocumentKeyError } from './errors/DocumentKeyError'

export function CreateDocumentKey(document: any, properties: string[]): string {
  const navigator = ObjectNavigator.from(document)

  const values = properties.map(property => {
    const current = navigator.get(property)

    if (current.value) {
      return current.value
    }

    throw new DocumentKeyError(document, property)
  })

  return Slugify(values.join('_'))
}
