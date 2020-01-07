import { Timestamp } from './types/Timestamp'

export interface Clip {
  filename: string
  timestamp: Timestamp
}

export const ClipKeys = ['filename']
