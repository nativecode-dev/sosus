import os from 'os'

import { fs } from '@nofrills/fs'
import { Lincoln } from '@nofrills/scrubs'
import { ObjectNavigator } from '@nofrills/types'
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
  readonly config: T

  private readonly env: DeepPartial<T>
  private readonly filepath: string
  private readonly log: Lincoln

  private objectNavigator: ObjectNavigator

  constructor(filename: string, config: DeepPartial<T>, logger: Lincoln) {
    this.log = logger.extend(filename)

    const options = { env: process.env, casing: EnvCaseOptions.LowerCase, prefix: 'sosus' }
    this.env = Env.from(options).toObject()

    const instance = Merge<T>([config, this.env])
    this.objectNavigator = ObjectNavigator.from(instance)
    this.config = instance
    this.filepath = fs.join(this.config.root, filename)
  }

  get filename(): string {
    return this.filepath
  }

  protected get nav() {
    return this.objectNavigator
  }

  get value(): T {
    return this.objectNavigator.toObject()
  }

  get machine() {
    return this.objectNavigator.getValue<string>('machine')
  }

  get root() {
    return this.objectNavigator.getValue<string>('root')
  }

  async load() {
    try {
      const partial = this.config as DeepPartial<unknown>

      if (await fs.exists(this.filepath)) {
        const json = await fs.json<DeepPartial<T>>(this.filepath)
        const instance = Merge<T>([DefaultConfig, json, partial, this.env])
        this.objectNavigator = ObjectNavigator.from(instance)
        this.log.trace('load-config', instance)
      } else {
        const instance = Merge<T>([DefaultConfig, partial, this.env])
        this.objectNavigator = ObjectNavigator.from(instance)
        this.log.trace('echo-config', instance)
      }
    } catch (error) {
      console.error(error)
    }

    return this.value
  }

  async save() {
    try {
      if ((await fs.exists(this.root)) === false) {
        await fs.mkdirp(this.root, true)
      }

      return fs.save<T>(this.filepath, this.value)
    } catch (error) {
      console.error(error)
      return false
    }
  }

  getValue<V>(path: string): V {
    return this.objectNavigator.getValue<V>(path)
  }
}
