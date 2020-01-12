import 'reflect-metadata'

export * from './SyncServer'
export * from './SyncServerConfig'

import main from './main'

main().catch(console.error)
