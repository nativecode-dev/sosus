# `data`

> Library to work with document repositories.

## Usage

```bash
npm install @sosus/core-data
```

## Usage Details

You have to create derived types for `DocumentContext` and `Documents<T>`. A `DocumentContext` represents the document store, which uses the `meta__doctype` to represent the document type.

## Example

```typescript

// Create interface that represent models.
export interface EnvironmentVariable {
  name: string
  value: string
}

export interface User {
  home: string
  username: string
}

// Create model documents.
export interface EnvironmentVariableDocument extends Document, EnvironmentVariable {
  timestamp: number
}

export interface UserDocument extends Document, User {
  timestamp: number
}

// Create primary document context.
export class TestContext extends DocumentContext<CouchConfig> {
  users: Users = new Users('user', this.store)
  variables: EnvironmentVariables = new EnvironmentVariables('env', this.store)
}

// Create specific document stores.
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
```
