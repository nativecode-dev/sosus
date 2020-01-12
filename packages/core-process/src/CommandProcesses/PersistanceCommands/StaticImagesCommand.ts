import { CacheType } from '@sosus/core-models'
import { SystemContext } from '@sosus/data-system'
import { Base64, Lifecycle, Lincoln, LoggerType, inject, injectable, fs, scoped } from '@sosus/core'

import { CommandProcess } from '../CommandProcess'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class StaticImagesCommand implements CommandProcess<void> {
  private readonly log: Lincoln

  private cancelled = false

  readonly name: string = 'command-staticimages'

  constructor(private readonly system: SystemContext, @inject(LoggerType) logger: Lincoln) {
    this.log = logger.extend(this.name)
    this.log.trace('created')
  }

  async cancel() {
    this.cancelled = true
  }

  async execute(path: string) {
    this.log.trace(path)

    const caches = await this.system.cache.find({
      selector: { type: CacheType.http, encoded: true },
      limit: Number.MAX_SAFE_INTEGER,
    })

    await Promise.all(
      caches.map(async cache => {
        if (this.cancelled) {
          return Promise.resolve()
        }

        if ((await fs.exists(path)) === false) {
          await fs.mkdirp(path, true)
        }

        const buffer = Buffer.from(Base64.atob(cache.content))
        const filename = fs.join(path, cache.content_identifier)
        await fs.writeFile(filename, buffer)
        this.log.debug('wrote', filename)
      }),
    )
  }
}
