import { SonarrOptions } from '@nativecode/sonarr'
import { RadarrOptions } from '@nativecode/radarr'
import { PlexClientOptions } from '@nativecode/plex'
import { Config, DeepPartial, NpmPackage } from '@sosus/core'

export interface ProcessConfig extends Config {
  plex: PlexClientOptions

  radarr: RadarrOptions
  sonarr: SonarrOptions
}

const packageInfo: NpmPackage = require('../package.json')

export const ProcessConfigType = Symbol('ProcessConfig')

export const DefaultProcessConfig: DeepPartial<ProcessConfig> = {
  plex: {
    app: {
      name: 'sosus',
      version: packageInfo.version,
    },
    host: 'localhost',
    port: 32400,
  },

  radarr: {
    host: 'localhost',
    port: 7878,
  },

  sonarr: {
    host: 'localhost',
    port: 8989,
  },
}
