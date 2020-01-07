export interface RedisConfig {
  host: string
  port: number
}

export const RedisConfigType = Symbol('RedisConfig')
