import { Config, Configuration, Logger, DeepPartial, DefaultConfig } from '@sosus/core'

export interface CliConfig extends Config {}

export const DefaultCliConfig: DeepPartial<CliConfig> = {
  ...DefaultConfig,
}

const log = Logger.extend('main')

async function main() {
  const loader = new Configuration<CliConfig>('.sosus-cli.json', DefaultCliConfig, log)
  await loader.save()
}

main().catch(console.log)
