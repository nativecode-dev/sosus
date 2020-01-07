import { Media } from './types/Media'
import { Timestamp } from './types/Timestamp'

export interface Clip extends Media {
  timestamp: Timestamp
}

export const ClipKeys = ['title']
