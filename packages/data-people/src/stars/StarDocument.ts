import { Document } from '@sosus/core-data'
import { Star } from '@sosus/core-models'

export interface StarDocument extends Document, Star {
  refresh: boolean
}
