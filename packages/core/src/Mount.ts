import nfs from 'node-nfsc'

export class Mount {
  private readonly stash: nfs.V3

  constructor(private readonly options: Partial<nfs.MountOptions> = {}) {
    this.stash = new nfs.V3(options)
  }

  lookup(directory: Buffer, filename: Buffer): Promise<{ file: any; obj: any; dir: any }> {
    return new Promise((resolve, reject) => {
      this.stash.lookup(directory, filename, (error, file, obj, dir) => {
        if (error) {
          reject(error)
        } else {
          resolve({ file, obj, dir })
        }
      })
    })
  }

  mount(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.stash.mount((error, buffer) => {
        if (error) {
          reject(error)
        } else {
          resolve(buffer)
        }
      })
    })
  }

  unmount(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stash.unmount(error => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}
