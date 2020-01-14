import { expect } from './helpers'

import { PlexClient } from '../src/Clients/PlexClient'

describe('when using PlexAPI', () => {
  it('should create instance', () => {
    const options = {
      hostname: 'plex.in.nativecode.com',
    }

    const plex = new PlexClient(options)
    console.log(plex)
    expect(plex.hostname).to.equal(options.hostname)
  })
})
