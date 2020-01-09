import { ObjectNavigator, Slugify } from '@sosus/core'

export function CreateDocumentKey(document: any, properties: string[]): string {
  const navigator = ObjectNavigator.from(document)

  const values = properties.map(property => {
    const current = navigator.get(property)

    if (current.value) {
      return current.value
    }

    throw new Error(`key property now found: ${property}`)
  })
  return Slugify(values.join('_'))
}
