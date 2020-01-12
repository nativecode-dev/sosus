import { Config, DeepPartial } from '@sosus/core'

export interface ProcessConfig extends Config {
  radarr: {
    apikey: string
    endpoint: string
  }

  sonarr: {
    apikey: string
    endpoint: string
  }
}

export const ProcessConfigType = Symbol('ProcessConfig')

export const DefaultProcessConfig: DeepPartial<ProcessConfig> = {
  radarr: {
    endpoint: 'http://localhost:7878',
  },

  sonarr: {
    endpoint: 'http://localhost:8989',
  },
}
