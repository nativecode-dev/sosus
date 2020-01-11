import os from 'os'
import path from 'path'

import { container } from '@sosus/core'

import { MediaContextConfig } from '@sosus/data-media'
import { PeopleContextConfig } from '@sosus/data-people'
import { SystemContextConfig } from '@sosus/data-system'

import { ApiConfig } from './ApiConfig'
import { ApiServer } from './ApiServer'
import { ApiServerConfig } from './ApiServerConfig'

function getDefaultPort(): number {
  if (process.env.SOSUS_API_PORT) {
    return parseInt(process.env.SOSUS_API_PORT, 0)
  }

  return 9000
}

function getDefaultRoot(): string {
  if (process.env.SOSUS_ROOT) {
    return process.env.SOSUS_ROOT
  }

  if (process.env.HOME) {
    return path.join(process.env.HOME, '.config', 'sosus')
  }

  return process.cwd()
}

const DefaultApiServerConfig: ApiServerConfig = {
  connections: {
    media: { couch: { adapter: 'memory', name: 'media' } },
    people: { couch: { adapter: 'memory', name: 'people' } },
    system: { couch: { adapter: 'memory', name: 'system' } },
  },
  enableSessions: false,
  enableWebSockets: false,
  machine: os.hostname(),
  port: getDefaultPort(),
  root: getDefaultRoot(),
}

export default async function() {
  const loader = new ApiConfig('.sosus-api.json', DefaultApiServerConfig)
  const config = await loader.load(DefaultApiServerConfig)

  container.register(MediaContextConfig, { useValue: config.connections.media.couch })
  container.register(PeopleContextConfig, { useValue: config.connections.people.couch })
  container.register(SystemContextConfig, { useValue: config.connections.system.couch })

  const server = container.resolve(ApiServer)
  return server.start(config.port)
}
