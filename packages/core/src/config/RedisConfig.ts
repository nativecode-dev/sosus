import { DeepPartial } from '../DeepPartial'

export interface RedisConfig {
  host: string
  port: number
}

export const DefaultRedisConfig: DeepPartial<RedisConfig> = {
  host: 'localhost',
  port: 6379,
}

export const RedisConfigType = Symbol('RedisConfig')
