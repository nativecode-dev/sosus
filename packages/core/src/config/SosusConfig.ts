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

const { SOSUS_ROOT } = process.env
const ROOT = fs.join(SOSUS_ROOT || os.homedir(), '.config', 'sosus')

const DEFAULTS: Config = {
  machine: os.hostname(),
  port: Math.floor(Math.random() * 100) + 10000,
  root: ROOT,
}

export abstract class SosusConfig<T extends Config> {
  protected readonly filename: string

  private readonly env: DeepPartial<T>

  private objectNavigator: ObjectNavigator

  constructor(filename: string, config: DeepPartial<T>) {
    const options = { env: process.env, casing: EnvCaseOptions.LowerCase, prefix: 'sosus' }
    this.env = Env.from(options).toObject()
    this.filename = fs.join(config.root || ROOT, filename)

    const instance = Merge<T>([DEFAULTS as DeepPartial<T>, config, this.env])
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
        const instance = Merge<T>([DEFAULTS as DeepPartial<T>, this.defaults, config || {}, this.env])
        this.objectNavigator = ObjectNavigator.from(instance)
        console.log(this.value)
      } else if (await fs.exists(this.filename)) {
        const json = await fs.json<DeepPartial<T>>(this.filename)
        const instance = Merge<T>([DEFAULTS as DeepPartial<T>, this.defaults, json, config || {}, this.env])
        this.objectNavigator = ObjectNavigator.from(instance)
        console.log(this.filename, this.value)
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
