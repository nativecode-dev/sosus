import 'mocha'

import path from 'path'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

export const expect = chai.use(chaiAsPromised).expect
export const TIMEOUT_LONG: number = 10000
export const TIMEOUT_SHORT: number = 5000

export const PATHS: {
  artifacts: () => string
  cache: () => string
  specs: () => string
} = {
  artifacts: () => path.join(PATHS.specs(), 'artifacts'),
  cache: () => path.join(process.cwd(), '.cache'),
  specs: () => path.resolve(path.join(__dirname, '..')),
}
