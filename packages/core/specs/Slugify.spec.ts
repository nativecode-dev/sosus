import { expect } from './helpers'
import { Slugify } from '../src/utils/Slugify'

describe('when using Slugify', () => {
  it('should remove additional characters', () => {
    const original = '[user] (test)'
    expect(Slugify(original)).to.equal('user_test')
  })
})
