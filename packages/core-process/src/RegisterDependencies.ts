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

  container.register<RadarrClient>(RadarrClient, {
    useFactory: container => {
      const config = container.resolve<ProcessConfig>(ProcessConfigType)
      const logger = container.resolve<Lincoln>(LoggerType)
      return new RadarrClient({ apikey: config.radarr.apikey, host: config.radarr.host }, logger)
    },
  })

  container.register<SonarrClient>(SonarrClient, {
    useFactory: container => {
      const config = container.resolve<ProcessConfig>(ProcessConfigType)
      const logger = container.resolve<Lincoln>(LoggerType)
      return new SonarrClient({ apikey: config.sonarr.apikey, host: config.sonarr.host }, logger)
    },
  })
}
