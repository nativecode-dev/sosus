import { CouchConfig } from './config/CouchConfig'

export interface Connection {
  couch: CouchConfig
  replicate?: {
    pull?: CouchConfig
    push?: CouchConfig
  }
}
