import { CouchConfig } from '@sosus/core'

export interface Connection {
  couch: CouchConfig
  replicate?: {
    pull?: CouchConfig
    push?: CouchConfig
  }
}
