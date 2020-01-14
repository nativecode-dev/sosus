import { PlexCloud } from '@nativecode/plex'
import { RadarrClient } from '@nativecode/radarr'
import { SonarrClient } from '@nativecode/sonarr'
import { DependencyContainer, LoggerType, Lincoln } from '@sosus/core'

import { ProcessConfigType, ProcessConfig } from './ProcessConfig'

import { CommandType } from './CommandProcesses/Command'
import { CommandInstance } from './CommandProcesses/CommandInstance'
import { TagMatchCommand } from './CommandProcesses/PersistanceCommands/TagMatchCommand'
import { CacheImagesCommand } from './CommandProcesses/PersistanceCommands/CacheImagesCommand'
import { RadarrImport } from './CommandProcesses/SyncCommands/Radarr/RadarrImport'
import { SonarrImport } from './CommandProcesses/SyncCommands/Sonarr/SonarrImport'
import { RadarrUnmonitor } from './CommandProcesses/SyncCommands/Radarr/RadarrUnmonitor'
import { SonarrUnmonitor } from './CommandProcesses/SyncCommands/Sonarr/SonarrUnmonitor'

export function registerCommands(container: DependencyContainer) {
  container.register<CommandInstance>(CommandType, CacheImagesCommand)
  container.register<CommandInstance>(CommandType, TagMatchCommand)
  container.register<CommandInstance>(CommandType, RadarrImport)
  container.register<CommandInstance>(CommandType, RadarrUnmonitor)
  container.register<CommandInstance>(CommandType, SonarrImport)
  container.register<CommandInstance>(CommandType, SonarrUnmonitor)

  container.register<PlexCloud>(PlexCloud, {
    useFactory: container => {
      const config = container.resolve<ProcessConfig>(ProcessConfigType)
      const logger = container.resolve<Lincoln>(LoggerType)

      const options = {
        auth: {
          username: config.plex.auth?.username,
          password: config.plex.auth?.password,
        },
        host: config.radarr.host,
      }

      return new PlexCloud(options, logger)
    },
  })

  container.register<RadarrClient>(RadarrClient, {
    useFactory: container => {
      const config = container.resolve<ProcessConfig>(ProcessConfigType)
      const logger = container.resolve<Lincoln>(LoggerType)
      const options = { apikey: config.radarr.apikey, host: config.radarr.host }
      return new RadarrClient(options, logger)
    },
  })

  container.register<SonarrClient>(SonarrClient, {
    useFactory: container => {
      const config = container.resolve<ProcessConfig>(ProcessConfigType)
      const logger = container.resolve<Lincoln>(LoggerType)
      const options = { apikey: config.sonarr.apikey, host: config.sonarr.host }
      return new SonarrClient(options, logger)
    },
  })
}
