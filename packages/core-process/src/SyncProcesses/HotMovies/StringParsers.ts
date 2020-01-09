import { Moment, Slugify, DeepPartial } from '@sosus/core'
import { DictionaryOf } from '@nofrills/collections'
import { StarAttributes, GenderType } from '@sosus/core-models'

export function cleanName(name: string): string {
  return name.trim().replace(/\(([iv]+|[F]female)\)/, '')
}

export function cleanSlug(slug: string): string {
  const cleaned = cleanName(slug)
  return Slugify(cleaned).replace(/^([A-Za-z]{1}_[A-Za-z]{1}_)/, value => value.replace('_', ''))
}

export function transformAliases(value: string): DictionaryOf<string> {
  return value
    .split(',')
    .map(x => x.trim())
    .reduce<DictionaryOf<string>>((aliases, alias) => {
      const slug = cleanSlug(alias)
      aliases[slug] = cleanName(alias)
      return aliases
    }, {})
}

export function transformBirthDate(value: string, attributes: DeepPartial<StarAttributes>): string {
  if (value.includes('/')) {
    const parts = value.split('/')
    const dob = parts[0].trim()
    const sign = parts[1].trim()
    attributes.dob = Moment(dob, 'MMMM Do YYYY').toDate()
    attributes.zodiac_sign = sign
    return dob
  }
  attributes.dob = Moment(value, 'MMMM Do YYYY').toDate()
  return value
}

export function echo(value: string): string {
  return value
}

export function transformGender(value: string): string {
  return value.trim() === 'Female' ? GenderType.female : GenderType.male
}

export function transformBoolean(value: string): boolean {
  return value.toLowerCase() === 'yes' ? true : false
}

export function transformYearsActive(value: string): DictionaryOf<string> {
  if (value.length > 0) {
    const parts = value.split('-').map(x => x.trim())
    const start = parts[0]
    const end = parts.length === 2 ? parts[1] : ''
    return { end, start }
  }
  return { end: '', start: '' }
}
