import PouchDB from 'pouchdb'
import Find from 'pouchdb-find'
import InMemory from 'pouchdb-adapter-memory'
import NodeWebSql from 'pouchdb-adapter-node-websql'
import Upsert from 'pouchdb-upsert'

PouchDB.plugin(Find)
PouchDB.plugin(InMemory)
PouchDB.plugin(NodeWebSql)
PouchDB.plugin(Upsert)

export * from './Connection'
export * from './Document'
export * from './DocumentContext'
export * from './DocumentStore'
export * from './Documents'
