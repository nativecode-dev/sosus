import { CreateLogger, CreateOptions, ScrubsInterceptor } from '@nofrills/scrubs'

const options = CreateOptions('sosus', [], [['scrubs', ScrubsInterceptor]])

export const Logger = CreateLogger(options)
export const LoggerType = Symbol('Logger')
