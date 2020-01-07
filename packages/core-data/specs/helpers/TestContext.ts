import path from 'path'

import { CouchConfig } from '@sosus/core'

import { PATHS } from '.'
import { Document } from '../../src/Document'
import { DocumentContext } from '../../src/DocumentContext'
import { Documents } from '../../src/Documents'

export interface EnvironmentVariable {
  name: string
  value: string
}

export interface EnvironmentVariableDocument extends Document, EnvironmentVariable {}

export interface User {
  home: string
  username: string
}

export interface UserDocument extends Document, User {}

export class TestContext extends DocumentContext<CouchConfig> {
  users: Users = new Users('user', this.store)
  variables: EnvironmentVariables = new EnvironmentVariables('env', this.store)

  initialize() {
    return Promise.resolve()
  }
}

export class EnvironmentVariables extends Documents<EnvironmentVariableDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  protected get keyProperties(): string[] {
    return ['name']
  }
}

export class Users extends Documents<UserDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  protected get keyProperties(): string[] {
    return ['username']
  }
}

export const DefaultTestContextConfig: CouchConfig = {
  name: path.join(PATHS.cache(), 'users'),
}
