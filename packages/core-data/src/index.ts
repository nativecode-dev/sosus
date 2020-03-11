export * from './config'

export * from './Connection'
export * from './Document'
export * from './DocumentContext'
export * from './DocumentIndexOptions'
export * from './DocumentStore'
export * from './Documents'

import PouchDB from 'pouchdb'
import Find from 'pouchdb-find'
import InMemory from 'pouchdb-adapter-memory'
import Upsert from 'pouchdb-upsert'

PouchDB.plugin(Find)
PouchDB.plugin(InMemory)
PouchDB.plugin(Upsert)
