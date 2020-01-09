import { Config } from '@sosus/core'
import { DictionaryOf } from '@nofrills/types'

export interface CronOptions extends DictionaryOf<string> {
  primary: string
  secondary: string
}

export interface SyncConfig extends Config {
  cron: CronOptions
  enabled: boolean
  name: string
  user_agent: string
}

export const DefaultSyncConfig: Partial<SyncConfig> = {
  cron: {
    primary: '0 0 * * 6',
    secondary: '*/20 * * * *',
  },
  enabled: false,
  name: 'default',
  user_agent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
}
