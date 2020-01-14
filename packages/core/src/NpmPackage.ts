export interface NpmPackage {
  author?: string
  description?: string
  homepage?: string
  name: string
  version: string
}

export const NpmPackageType = Symbol('NpmPackage')
