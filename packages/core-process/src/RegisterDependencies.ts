import { DependencyContainer } from '@sosus/core'

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
}
