import { CacheType } from '@sosus/core-models'
import { SystemContext } from '@sosus/data-system'
import { Base64, Lifecycle, Lincoln, LoggerType, inject, injectable, fs, scoped } from '@sosus/core'

import { Command } from '../Command'

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class CacheImagesCommand extends Command {
  constructor(private readonly system: SystemContext, @inject(LoggerType) logger: Lincoln) {
    super('images-cache', logger)
  }

  async exec(path: string) {
    this.log.trace(path)

    const caches = await this.system.cache.find({
      selector: { type: CacheType.http, encoded: true },
      limit: Number.MAX_SAFE_INTEGER,
    })

    const results = await Promise.all(
      caches.map(async cache => {
        if (this.cancelled) {
          return
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

    return results.length
  }
}
