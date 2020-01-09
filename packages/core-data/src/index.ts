import PouchDB from 'pouchdb'
import Find from 'pouchdb-find'
import Upsert from 'pouchdb-upsert'

PouchDB.plugin(Find)
PouchDB.plugin(Upsert)

export * from './Document'
export * from './DocumentContext'
export * from './DocumentStore'
export * from './Documents'
