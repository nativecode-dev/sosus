import 'mocha'

import path from 'path'

import { CouchConfig } from '@sosus/core-data'

import { expect, PATHS } from './helpers'
import { SystemContext } from '../src/SystemContext'
import { CacheType } from '@sosus/core-models'

const config: CouchConfig = {
  adapter: 'memory',
  name: path.join(PATHS.cache(), 'system.db'),
}

describe('when using SystemContext', () => {
  const system = new SystemContext(config)

  before(async () => {
    await system.initialize()
  })

  it('should create cache', async () => {
    const document = system.cache.createDocument({
      content: '<html></html>',
      content_identifier: 'test',
      content_type: 'text/html',
      source: { key: 'test', origin: 'test' },
      timestamp: { created: new Date(), modified: new Date() },
      type: CacheType.http,
    })
    const id = system.cache.keyId(document)
    const cache = await system.cache.update(document)
    expect(cache._id).to.equal(id)
  })

  it('should delete cache', async () => {
    const document = system.cache.createDocument({
      content_identifier: 'test',
      content_type: 'text/html',
      source: { origin: 'test' },
      type: CacheType.http,
    })
    const id = system.cache.keyId(document)
    const cache = await system.cache.byId(id)
    const response = await system.cache.delete(cache._id, cache._rev)
    expect(response.ok).to.be.true
  })
})
