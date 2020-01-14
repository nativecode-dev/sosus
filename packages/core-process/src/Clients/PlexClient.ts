import PlexAPI from 'plex-api'

export class PlexClient extends PlexAPI {
  constructor(options: string | PlexAPI.PlexOptions) {
    super(options)
  }
}
