import path from 'path'

import { Documents } from '@sosus/core-data'
import { CacheKeys } from '@sosus/core-models'

import { CacheDocument } from './CacheDocument'
import { EncodingType, Hash } from '@sosus/core'

export class Caches extends Documents<CacheDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  async createHttpCache(url: string, content: string, contentType: string, encoding: EncodingType = 'utf8') {
    const document = this.createDocument({
      content,
      content_identifier: path.basename(url),
      content_type: contentType,
      source: { key: Hash(url), origin: url },
      timestamp: { created: new Date() },
    })

    const exists = await this.exists(document._id)

    if (exists === false) {
      return this.update(document)
    }

    return this.byId(document._id)
  }

  async createHttpBufferCache(url: string, buffer: Buffer, contentType: string) {
    const document = this.createDocument({
      content: buffer.toString(),
      content_identifier: path.basename(url),
      content_type: contentType,
      source: { key: Hash(url), origin: url },
      timestamp: { created: new Date() },
    })

    const exists = await this.exists(document._id)

    if (exists === false) {
      const updated = await this.update(document)
      return Buffer.from(updated.content)
    }

    const cache = await this.byId(document._id)
    return Buffer.from(cache.content)
  }

  protected get keyProperties() {
    return CacheKeys
  }
}
