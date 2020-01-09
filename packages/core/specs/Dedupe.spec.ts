import { expect } from './helpers'
import { Dedupe } from '../src/Dedupe'

describe('when using Dedupe', () => {
  it('should de-dupe array', () => {
    const array = [0, 0, 1, 2, 2, 3]
    const deduped = Dedupe(array)
    expect(deduped).to.deep.equal([0, 1, 2, 3])
  })
})
