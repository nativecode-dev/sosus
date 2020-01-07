import { Source } from './types/Source'

export interface FileLocation {
  file_id: string
  path: string
  source: Source
}

export const FileLocationKeys = ['file_id']
