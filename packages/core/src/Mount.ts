import { exec } from 'child_process'

import { Merge } from './utils'
import { fs } from '@nofrills/fs'

export interface MountOptions {
  opts: string[]
  source: string
  target: string
}

const DefaultMountOptions: Partial<MountOptions> = {
  opts: [],
}

export class Mount {
  private readonly options: MountOptions

  constructor(options: Partial<MountOptions>) {
    this.options = Merge<MountOptions>([DefaultMountOptions, options])
  }

  mount() {
    return new Promise(async (resolve, reject) => {
      if ((await fs.exists(this.options.target)) === false) {
        await fs.mkdirp(this.options.target)
      }

      const cmd = `mount.nfs ${this.options.source} ${this.options.target}`

      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          reject(error)
        } else if (stderr) {
          reject(stderr)
        } else {
          resolve(stdout)
        }
      })
    })
  }

  umount() {
    return new Promise(async (resolve, reject) => {
      if (await fs.exists(this.options.target)) {
        const cmd = `umount ${this.options.target}`

        exec(cmd, (error, stdout, stderr) => {
          if (error) {
            reject(error)
          } else if (stderr) {
            reject(stderr)
          } else {
            resolve(stdout)
          }
        })
      } else {
        reject(new Error(`mount target not found: ${this.options.target}`))
      }
    })
  }
}
