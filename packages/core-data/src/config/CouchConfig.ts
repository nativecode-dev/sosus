import { CouchAuthConfig } from './CouchAuthConfig'

export interface CouchConfig {
  adapter?: string
  auth?: CouchAuthConfig
  auto_compaction?: boolean
  deterministic_revs?: boolean
  revs_limit?: number
  name: string
}

export const CouchConfigType = Symbol('CouchConfig')
