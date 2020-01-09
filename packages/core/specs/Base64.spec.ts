import { expect } from './helpers'
import { Base64 } from '../src/Base64'

describe('when using Base64', () => {
  it('should convert from base64 buffer', () => expect(Base64.btoa(Buffer.from('test'))).to.equal('dGVzdA=='))
  it('should convert from base64 string', () => expect(Base64.btoa('test')).to.equal('dGVzdA=='))
  it('should convert to base64', () => expect(Base64.atob('dGVzdA==')).to.equal('test'))
})
