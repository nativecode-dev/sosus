import { fs } from '@nofrills/fs'

import { expect } from './helpers'
import { Mount } from '../src/Mount'

if (!process.env.CI) {
  describe('when using Mount', () => {
    const source = 'data:/data/test'
    const target = '/mnt/test'

    xit('should mount folder', async () => {
      const mount = new Mount({ source, target })
      await mount.mount()
      const files = await fs.list(target)
      expect(files).to.not.be.empty
    })

    xit('should unmount folder', async () => {
      const mount = new Mount({ source, target })
      await mount.umount()
      const files = await fs.list(target)
      expect(files).to.be.empty
    })
  })
}
