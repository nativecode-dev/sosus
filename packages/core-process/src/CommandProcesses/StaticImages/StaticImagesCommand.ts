import { CacheType } from '@sosus/core-models'
import { SystemContext } from '@sosus/data-system'
import { Base64, Lifecycle, injectable, fs, scoped, Logger, Lincoln } from '@sosus/core'

import { CommandProcess } from '../CommandProcess'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class StaticImagesCommand implements CommandProcess<void> {
  private readonly log: Lincoln

  private cancelled = false

  readonly name: string = 'command-staticimages'

  constructor(private readonly system: SystemContext) {
    this.log = Logger.extend(this.name)
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

        const exists = await fs.exists(path, true)

        if (exists === false) {
          const buffer = Buffer.from(Base64.atob(cache.content))
          const filename = fs.join(path, cache.content_identifier)

          await fs.mkdirp(path, true)
          await fs.writeFile(filename, buffer)

          this.log.debug('wrote', filename)
        }
      }),
    )
  }
}