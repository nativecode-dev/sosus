import { Source } from './Source'

export interface FileLocation {
  file: string
  path: string
  source: Source
}

export const FileLocationKeys = ['file']
