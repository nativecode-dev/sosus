import { Timestamp } from './Timestamp'

export interface File {
  filename: string
  timestamp: Timestamp
}

export const FileKeys = ['filename']
