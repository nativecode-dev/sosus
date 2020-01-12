import { URL } from 'url'
import { RadarrClient } from '@nativecode/radarr'
import { SonarrClient } from '@nativecode/sonarr'
import { DependencyContainer, LoggerType, Lincoln } from '@sosus/core'

import { ProcessConfigType, ProcessConfig } from './ProcessConfig'
import { CommandProcessType, CommandProcess } from './CommandProcesses'

import { TagMatchCommand } from './CommandProcesses/PersistanceCommands/TagMatchCommand'
import { StaticImagesCommand } from './CommandProcesses/PersistanceCommands/StaticImagesCommand'
import { RadarrImport } from './CommandProcesses/SyncCommands/Radarr/RadarrImport'
import { SonarrImport } from './CommandProcesses/SyncCommands/Sonarr/SonarrImport'
import { RadarrUnmonitor } from './CommandProcesses/SyncCommands/Radarr/RadarrUnmonitor'
import { SonarrUnmonitor } from './CommandProcesses/SyncCommands/Sonarr/SonarrUnmonitor'

export function registerCoreProcessDependencies(container: DependencyContainer) {
  container.register<CommandProcess<any>>(CommandProcessType, StaticImagesCommand)
  container.register<CommandProcess<any>>(CommandProcessType, TagMatchCommand)
  container.register<CommandProcess<any>>(CommandProcessType, RadarrImport)
  container.register<CommandProcess<any>>(CommandProcessType, SonarrImport)
  container.register<CommandProcess<any>>(CommandProcessType, RadarrUnmonitor)
  container.register<CommandProcess<any>>(CommandProcessType, SonarrUnmonitor)

  container.register<RadarrClient>(RadarrClient, {
    useFactory: container => {
      const config = container.resolve<ProcessConfig>(ProcessConfigType)
      const logger = container.resolve<Lincoln>(LoggerType)
      return new RadarrClient(new URL(config.radarr.endpoint), config.radarr.apikey, logger)
    },
  })

  container.register<SonarrClient>(SonarrClient, {
    useFactory: container => {
      const config = container.resolve<ProcessConfig>(ProcessConfigType)
      const logger = container.resolve<Lincoln>(LoggerType)
      return new SonarrClient(new URL(config.radarr.endpoint), config.radarr.apikey, logger)
    },
  })
}
