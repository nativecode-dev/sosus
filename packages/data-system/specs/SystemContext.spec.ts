import 'mocha'

import path from 'path'

import { CouchConfig } from '@sosus/core'

import { expect, PATHS } from './helpers'
import { SystemContext } from '../src/SystemContext'
import { CacheType } from '@sosus/core-models'

const config: CouchConfig = {
  name: path.join(PATHS.cache(), 'system'),
}

describe('when using SystemContext', () => {
  const system = new SystemContext(config)

  before(async () => {
    await system.initialize()
  })

  it('should create cache', async () => {
    const document = system.cache.createDocument({
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
      content_type: 'text/html',
      type: CacheType.http,
    })
    const id = system.cache.keyId(document)
    const cache = await system.cache.byId(id)
    const response = await system.cache.delete(cache._id, cache._rev)
    expect(response.ok).to.be.true
  })
})
