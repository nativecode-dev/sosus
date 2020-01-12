import 'reflect-metadata'

import { expect } from './helpers'
import { CreateDocumentKey } from '../src/utils/CreateDocumentKey'

describe('when using CreateDocumentKey', () => {
  it('should create key with deep properties', () => {
    const document = {
      timestamp: {
        created: 'today',
      },
    }

    expect(CreateDocumentKey(document, ['timestamp.created'])).to.equal('today')
  })
})
