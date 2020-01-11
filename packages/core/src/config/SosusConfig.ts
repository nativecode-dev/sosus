import os from 'os'

import { fs } from '@nofrills/fs'
import { ObjectNavigator } from '@nofrills/types'
import { Env, EnvCaseOptions } from '@nofrills/env'

import { Merge } from '../Merge'
import { DeepPartial } from '../DeepPartial'

export const ConfigType = Symbol('Config')

export interface Config {
  machine: string
  port: number
  root: string
}

const ROOT = getDefaultRoot()

export const DefaultConfig: Config = {
  machine: os.hostname(),
  port: getDefaultPort(),
  root: ROOT,
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

  return process.cwd()
}

export abstract class SosusConfig<T extends Config> {
  protected readonly filename: string

  private readonly env: DeepPartial<T>

  private objectNavigator: ObjectNavigator

  constructor(filename: string, config: DeepPartial<T>) {
    const options = { env: process.env, casing: EnvCaseOptions.LowerCase, prefix: 'sosus' }
    this.env = Env.from(options).toObject()
    this.filename = fs.join(config.root || ROOT, filename)

    const instance = Merge<T>([DefaultConfig as DeepPartial<T>, config, this.env])
    this.objectNavigator = ObjectNavigator.from(instance)
  }

  protected abstract get defaults(): DeepPartial<T>

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

  async load(config?: DeepPartial<T>) {
    try {
      if (config) {
        const instance = Merge<T>([DefaultConfig as DeepPartial<T>, this.defaults, config || {}, this.env])
        this.objectNavigator = ObjectNavigator.from(instance)
      } else if (await fs.exists(this.filename)) {
        const json = await fs.json<DeepPartial<T>>(this.filename)
        const instance = Merge<T>([DefaultConfig as DeepPartial<T>, this.defaults, json, config || {}, this.env])
        this.objectNavigator = ObjectNavigator.from(instance)
      }
    } catch (error) {
      console.error(error)
    }

    return this.value
  }

  async save() {
    try {
      return fs.save<T>(this.filename, this.value)
    } catch (error) {
      console.error(error)
      return false
    }
  }

  getValue<V>(path: string): V {
    return this.objectNavigator.getValue<V>(path)
  }
}
