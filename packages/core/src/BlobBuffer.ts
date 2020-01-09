import blob2buffer from 'blob-to-buffer'

export function BlobBuffer(blob: Blob | Buffer): Promise<Buffer> {
  if (Buffer.isBuffer(blob)) {
    return Promise.resolve(blob)
  }

  return new Promise((resolve, reject) => {
    blob2buffer(blob, (error: Error, buffer: Buffer) => {
      if (error) {
        reject(error)
      } else {
        resolve(buffer)
      }
    })
  })
}
