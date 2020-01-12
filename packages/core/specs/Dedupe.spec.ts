import { expect } from './helpers'
import { Dedupe } from '../src/Dedupe'

describe('when using Dedupe', () => {
  it('should de-dupe array', () => {
    const source = [0, 0, 1, 2, 2, 3]
    const deduped = Dedupe(source)
    expect(deduped).to.deep.equal([0, 1, 2, 3])
  })

  it('should dedupe single item', () => {
    const source = ['first-item', 'first-item']
    const deduped = Dedupe(source)
    expect(deduped).to.deep.equal(['first-item'])
  })
})
