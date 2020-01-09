import { DictionaryOf } from '@nofrills/types'

export interface StarAttributes {
  [key: string]: any
  aliases: DictionaryOf<string>
  biography: string
  breast_size: string
  dob: Date
  dob_string: string
  ethnicity: string
  color_eyes: string
  color_hair: string
  height: string
  images: string[]
  implants: boolean
  piercings: string
  place_of_birth: string
  tattoos: string
  years: {
    end: string
    start: string
  }
  zodiac_sign: string
}
