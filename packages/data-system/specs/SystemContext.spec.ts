import 'mocha'

import path from 'path'

import { CouchConfig } from '@sosus/core'

import { expect, PATHS } from './helpers'
import { SystemContext } from '../src/SystemContext'

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
      source: { key: 'test', origin: 'test' },
      timestamp: { created: new Date(), modified: new Date() },
    })
    const cache = await system.cache.update(document)
    expect(cache._id).to.not.be.undefined
  })
})
