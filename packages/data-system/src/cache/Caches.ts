import path from 'path'

import { Documents, DocumentIndexOptions } from '@sosus/core-data'
import { CacheKeys, CacheType } from '@sosus/core-models'
import { EncodingType, Hash, Merge, MimeType, DeepPartial } from '@sosus/core'

import { CacheDocument } from './CacheDocument'

export class Caches extends Documents<CacheDocument> {
  readonly indexes: DocumentIndexOptions[] = [
    {
      index: {
        fields: ['content_identifier'],
        name: 'actor_content-identifier',
      },
    },
    {
      index: {
        fields: ['content_type'],
        name: 'actor_content-type',
      },
    },
    {
      index: {
        fields: ['content_encoded'],
        name: 'actor_content-encoded',
      },
    },
    {
      index: {
        fields: ['mimetype.media_type'],
        name: 'actor_content-mimetype-media-type',
      },
    },
    {
      index: {
        fields: ['source.key'],
        name: 'actor_source-key',
      },
    },
    {
      index: {
        fields: ['source.origin'],
        name: 'actor_source-origin',
      },
    },
    {
      index: {
        fields: ['type'],
        name: 'actor_type',
      },
    },
  ]

  createHttpCache(url: string, content: string, contentType: string, encoding: EncodingType = 'utf8') {
    return this.createHttpBufferCache(url, Buffer.from(content, encoding), contentType)
  }

  async createHttpBufferCache(url: string, buffer: Buffer, contentType: string) {
    const filename = path.basename(url)
    const mimetype = MimeType(contentType)

    const document = this.createDocument({
      mimetype,
      content: buffer.toString(),
      content_identifier: filename,
      content_type: contentType,
      source: { key: Hash(url), origin: url },
      timestamp: { created: new Date() },
      type: this.cacheTypeFrom(mimetype.media_type),
    })

    const exists = await this.exists(document._id)

    if (exists === undefined) {
      await this.update(document)
      await this.putAttachment(document._id, document._rev, filename, mimetype.media_type, buffer)
    }

    return this.byId(document._id)
  }

  async update(update: DeepPartial<CacheDocument>) {
    return super.update(
      Merge<DeepPartial<CacheDocument>>([
        update,
        { timestamp: { created: update.timestamp!.created, modified: new Date() } },
      ]),
    )
  }

  protected get keyProperties() {
    return CacheKeys
  }

  private cacheTypeFrom(type: string): CacheType {
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
