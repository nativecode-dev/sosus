import 'reflect-metadata'

export * from './ProcessorServer'
export * from './ProcessorServerConfig'

import main from './main'

main().catch(console.error)
