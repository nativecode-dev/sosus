import PouchDB from 'pouchdb'
import Find from 'pouchdb-find'
import InMemory from 'pouchdb-adapter-memory'
import Upsert from 'pouchdb-upsert'

PouchDB.plugin(Find)
PouchDB.plugin(InMemory)
PouchDB.plugin(Upsert)

export * from './config'

export * from './Connection'
export * from './Document'
export * from './DocumentContext'
export * from './DocumentStore'
export * from './Documents'
