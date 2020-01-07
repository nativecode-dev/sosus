import 'mocha'

import path from 'path'

import { CouchConfig } from '@sosus/core'

import { expect, PATHS } from './helpers'
import { SystemContext } from '../src/SystemContext'

const config: CouchConfig = {
  name: path.join(PATHS.cache(), 'system'),
}

describe('when using SystemContext', () => {
  it('should create cache', async () => {
    const system = new SystemContext(config)
    const cache = system.cache.createDocument({
      source: { key: 'test', origin: 'test' },
      timestamp: { created: new Date(), modified: new Date() },
    })
    expect(cache._id).to.not.be.undefined
  })
})
