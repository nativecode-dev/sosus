import { Config, DeepPartial } from '@sosus/core'

export interface ProcessConfig extends Config {
  radarr: {
    apikey: string
    host: string
  }

  sonarr: {
    apikey: string
    host: string
  }
}

export const ProcessConfigType = Symbol('ProcessConfig')

export const DefaultProcessConfig: DeepPartial<ProcessConfig> = {
  radarr: {
    host: 'localhost',
  },

  sonarr: {
    host: 'localhost',
  },
}
