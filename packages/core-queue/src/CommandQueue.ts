import { Queue, injectable, scoped, Lifecycle } from '@sosus/core'

import { Command } from './Command'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class CommandQueue extends Queue<Command> {}
