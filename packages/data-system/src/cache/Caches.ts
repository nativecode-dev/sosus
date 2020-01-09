import path from 'path'

import { Documents } from '@sosus/core-data'
import { CacheKeys, CacheType } from '@sosus/core-models'
import { EncodingType, Hash, Merge, MimeType } from '@sosus/core'

import { CacheDocument } from './CacheDocument'

export class Caches extends Documents<CacheDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  createHttpCache(url: string, content: string, contentType: string, encoding: EncodingType = 'utf8') {
    return this.createHttpBufferCache(url, Buffer.from(content, encoding), contentType)
  }

  async createHttpBufferCache(url: string, buffer: Buffer, contentType: string) {
    const filename = path.basename(url)
    const mimetype = MimeType(contentType)

    const document = this.createDocument({
      content: buffer.toString(),
      content_identifier: filename,
      content_type: contentType,
      media_type: mimetype.media_type,
      source: { key: Hash(url), origin: url },
      timestamp: { created: new Date() },
      type: this.getCacheType(mimetype.media_type),
    })

    const exists = await this.exists(document._id)

    if (exists === undefined) {
      await this.update(document)
      await this.putAttachment(document._id, document._rev, filename, mimetype.media_type, buffer)
    }

    return this.byId(document._id)
  }

  async update(update: Partial<CacheDocument>) {
    return super.update(
      Merge<Partial<CacheDocument>>([
        update,
        { timestamp: { created: update.timestamp!.created, modified: new Date() } },
      ]),
    )
  }

  protected get keyProperties() {
    return CacheKeys
  }

  private getCacheType(type: string): CacheType {
    const parts = type.split('/')

    switch (parts[0]) {
      case 'application':
        return CacheType.file
      case 'audio':
        return CacheType.audio
      case 'image':
        return CacheType.image
      case 'video':
        return CacheType.video
      case 'text': {
        if (parts[1] === 'html') {
          return CacheType.http
        }
        return CacheType.text
      }

      default: {
        return CacheType.unknown
      }
    }
  }
}
