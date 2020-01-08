import { DictionaryOf } from '@nofrills/types'

export interface CronOptions extends DictionaryOf<string> {
  primary: string
  secondary: string
}

export interface SyncConfig {
  cron: CronOptions
  enabled: boolean
  name: string
}

export const DefaultSyncOptions: Partial<SyncConfig> = {
  cron: {
    primary: '0 0 * * 6',
    secondary: '*/20 * * * *',
  },
  enabled: false,
  name: 'default',
}
