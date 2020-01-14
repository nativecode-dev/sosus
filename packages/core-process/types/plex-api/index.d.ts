declare namespace PlexAPI {
  export interface RequestOptions {
    uri: string
  }

  export interface PlexOptions {
    hostname: string
    identifier?: string
    product?: string
    version?: string
    device?: string
    deviceName?: string
    platform?: string
    platformVersion?: string
  }
}

declare module 'plex-api' {
  class PlexAPI {
    constructor(options: string | PlexAPI.PlexOptions)

    get authToken(): string
    get hostname(): string
    get managedUser(): any
    get password(): string
    get port(): number
    get username(): string

    deleteQuery(options: string | PlexAPI.RequestOptions): any
    find(options: string | PlexAPI.RequestOptions, criteria: any): any
    getHostname(): string
    getIdentifier(): string
    getPort(): number
    query(options: string | PlexAPI.RequestOptions): any
    perform(options: string | PlexAPI.RequestOptions): any
    postQuery(options: string | PlexAPI.RequestOptions): any
    putQuery(options: string | PlexAPI.RequestOptions): any
  }

  export = PlexAPI
}
