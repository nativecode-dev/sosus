import { Server } from './Server'
import { ServerConfig } from './ServerConfig'

export async function Bootstrap<T extends ServerConfig>(instance: Server<T>, config: T): Promise<Server<T>> {
  console.log('bootstrap started...')

  process.on('SIGTERM', () => process.exit())
  process.on('SIGHUP', () => process.exit())
  process.on('SIGUSR1', () => process.exit())
  process.on('SIGUSR2', () => process.exit())
  process.on('uncaughtException', async error => console.error(error))
  process.on('unhandledRejection', async error => console.error(error))

  await instance.initialize()
  await instance.start(config.port)

  return instance
}
