import os from 'os'

import { fs } from '@nofrills/fs'
import { Lincoln } from '@nofrills/scrubs'
import { Env, EnvCaseOptions } from '@nofrills/env'

import { Config } from './Config'
import { Merge } from '../utils/Merge'
import { DeepPartial } from '../DeepPartial'

export const ConfigType = Symbol('Config')

export const DefaultConfig: DeepPartial<Config> = {
  machine: os.hostname(),
  port: getDefaultPort(),
  root: getDefaultRoot(),
}

function getDefaultPort(): number {
  if (process.env.SOSUS_API_PORT) {
    return parseInt(process.env.SOSUS_API_PORT, 0)
  }

  return Math.floor(Math.random() * 100) + 10000
}

function getDefaultRoot(): string {
  if (process.env.SOSUS_ROOT) {
    return process.env.SOSUS_ROOT
  }

  if (process.env.HOME) {
    return fs.join(process.env.HOME, '.config', 'sosus')
  }

  return fs.join(process.cwd(), '.sosus')
}

export class Configuration<T extends Config> {
  private config: T

  private readonly env: DeepPartial<T>
  private readonly filepath: string
  private readonly log: Lincoln

  constructor(filename: string, config: DeepPartial<T>, logger: Lincoln) {
    this.log = logger.extend(filename)

    const options = { env: process.env, casing: EnvCaseOptions.LowerCase, prefix: 'sosus' }
    this.env = Env.from(options).toObject()

    this.config = Merge<T>([config, this.env])
    this.filepath = fs.join(this.config.root, filename)
  }

  get filename(): string {
    return this.filepath
  }

  get value(): T {
    return this.config
  }

  async load() {
    try {
      const partial = this.config as DeepPartial<unknown>

      if (await fs.exists(this.filepath)) {
        const json = await fs.json<DeepPartial<T>>(this.filepath)
        this.config = Merge<T>([partial, json, this.env])
        this.log.trace('load-config', this.config)
      } else {
        this.config = Merge<T>([partial, this.env])
        this.log.trace('echo-config', this.config)
      }
    } catch (error) {
      console.error(error)
    }

    return this.config
  }

  async save() {
    try {
      if ((await fs.exists(this.config.root)) === false) {
        await fs.mkdirp(this.config.root, true)
      }

      return fs.writeFile(this.filename, JSON.stringify(this.config, null, 2))
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
