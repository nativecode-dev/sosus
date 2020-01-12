import 'reflect-metadata'

export * from './ApiServer'
export * from './ApiServerConfig'

import main from './main'

main().catch(console.error)
