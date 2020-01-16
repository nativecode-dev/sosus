declare module 'node-nfsc' {
  type NfsError = null | { status: string }
  type NfsObject = object | null
  type NfsEntry = { cookie: Buffer; fileid: Buffer; name: string }

  namespace V3 {
    export type AccessCallback = (error: NfsError, access: number, postObjAttr: NfsObject) => void

    export type CommitCallback = (error: NfsError, verf: Buffer, attrs: { before: object, after: object }) => void

    export type GetAttrCallback = (error: NfsError, objAttributes: NfsObject) => void

    export type LookupCallback = (
      error: NfsError,
      object: Buffer,
      objectAttributes: NfsObject,
      dirAttributes: NfsObject,
    ) => void

    export type MountCallback = (error: NfsError, buffer: Buffer) => void

    export type ReadCallback = (error: NfsError) => void

    export type ReadDirCallback = (
      error: NfsError,
      dirAttributes: NfsObject,
      cookie: Buffer,
      eof: boolean,
      entries: NfsEntry,
    ) => void

    export type UnmountCallback = (error: NfsError) => void

    export type WriteCallback = (error: NfsError, file_wcc: { before: object; after: object }) => void

    export interface MountOptions {
      authenticationMethod?: 'none' | 'unix' | 'krb5' | 'krb5i' | 'krb5p'
      exportPath: string
      gid?: number
      host: string
      protocol?: 'tcp' | 'udp'
      timeout?: number
      uid?: number
    }

    export class V3 {
      constructor(options: Partial<MountOptions>)

      access(object: Buffer, access: number, callback: AccessCallback): void
      commit(object: Buffer, count: number, offset: number, callback: CommitCallback): void
      getattr(object: Buffer, callback: GetAttrCallback): void
      lookup(dir: Buffer, name: Buffer, callback: LookupCallback): void
      mount(callback: MountCallback): void
      read(object: Buffer, count: number, offset: number, callback: ReadCallback): void
      readdir(dir: Buffer, options: any, callback: ReadDirCallback): void
      readdirplus(dir: Buffer, options: any, callback: ReadDirCallback): void
      unmount(callback: UnmountCallback): void
      write(
        object: Buffer,
        count: number,
        offset: number,
        stable: 'FILE_SYNC' | 'DATA_SYNC',
        data: Buffer,
        callback: WriteCallback,
      ): void
    }
  }

  export = V3
}
