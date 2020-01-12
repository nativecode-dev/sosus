import { expect } from './helpers'
import { Logger } from '../src/Logger'
import { Config } from '../src/config/Config'
import { DeepPartial } from '../src/DeepPartial'
import { SosusConfig, DefaultConfig } from '../src/config/SosusConfig'

interface TestConfig extends Config {
  array: string[]
  name: string
}

const DefaultTestConfig: DeepPartial<TestConfig> = {
  ...DefaultConfig,
  array: ['string'],
  name: 'name',
}

describe('when using SosusConfig', () => {
  it('should load default config', async () => {
    const loader = new SosusConfig<TestConfig>('.sosus-test.json', DefaultTestConfig, Logger.extend('test'))
    const config = await loader.load()
    expect(config.array).to.deep.equal(['string'])
  })
})
