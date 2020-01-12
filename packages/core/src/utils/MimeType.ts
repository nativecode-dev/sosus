import { MimeTypeValue } from './MimeTypeValue'

export function MimeType(type: string): MimeTypeValue {
  const parts = type.split(';')
  const mediaType = parts[0].trim()

  if (parts.length === 1) {
    return { media_type: mediaType }
  }

  const text = parts[1].trim()
  const mimetype: any = { media_type: mediaType }
  const regex = /(charset|boundary)=(.*)/g
  let matches: RegExpExecArray | null = null

  do {
    matches = regex.exec(text)

    if (matches && matches.length > 2) {
      const name = matches[1].toLowerCase().trim()
      const value = matches[2].trim()
      mimetype[name] = value
    }
  } while (matches !== null)

  return mimetype
}
