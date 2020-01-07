import { Timestamp } from './types/Timestamp'

export interface File {
  filename: string
  timestamp: Timestamp
}

export const FileKeys = ['filename']
