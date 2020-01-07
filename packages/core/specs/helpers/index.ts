import 'mocha'

import path from 'path'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

export const expect = chai.use(chaiAsPromised).expect
export const TIMEOUT_LONG: number = 10000
export const TIMEOUT_SHORT: number = 5000

export const PATHS: { [key: string]: () => string } = {}
PATHS.cache = () => path.join(process.cwd(), '.cache')
PATHS.specs = () => path.resolve(path.join(__dirname, '..'))
PATHS.artifacts = () => path.join(PATHS.specs(), 'artifacts')
