import { Config, SosusConfig, Logger, DeepPartial, DefaultConfig } from '@sosus/core'

export interface CliConfig extends Config {}

export const DefaultCliConfig: DeepPartial<CliConfig> = {
  ...DefaultConfig,
}

const log = Logger.extend('main')

async function main() {
  const config = new SosusConfig<CliConfig>('.sosus-cli.json', DefaultCliConfig, log)
  log.trace(config)
}

main().catch(console.log)
