import { fs } from '@nofrills/fs'

import { monorepo } from './projects'

interface Reference {
  path: string
}

async function main() {
  const projects = await monorepo()

  const tasks = projects.map(async project => {
    const tspath = fs.join(project.location, 'tsconfig.json')
    const tsconfig = await fs.json<any>(tspath)

    tsconfig.references = project.dependencies.map<Reference>(dep => {
      const reference: any = {}
      const basename = fs.basename(dep.location)
      reference.path = fs.join(fs.relative(basename, process.cwd()), basename)
      return reference
    })

    await fs.writeFile(tspath, JSON.stringify(tsconfig, null, 2))
  })

  await Promise.all(tasks)
}

main().catch(console.error)
