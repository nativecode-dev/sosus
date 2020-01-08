import sha1 from 'sha1'
import { HashType } from './HashType'

export function Hash(value: string, type: HashType = HashType.sha1): string {
  switch (type) {
    default: {
      return sha1(value)
    }
  }
}
