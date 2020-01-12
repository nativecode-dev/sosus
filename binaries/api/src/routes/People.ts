import { Express } from 'express'
import { RouterType } from '@sosus/core-web'
import { PeopleContext } from '@sosus/data-people'
import { injectable, singleton, inject } from '@sosus/core'

import { ApiRoute } from '../ApiRoute'

@injectable()
@singleton()
export class People extends ApiRoute {
  constructor(@inject(RouterType) router: Express, private readonly people: PeopleContext) {
    super('series', router)
    this.log.debug('created', this.name)
  }

  register() {
    this.registerById('people/actors/:id', this.people.actors)
    this.registerCollection('people/actors', this.people.actors)

    this.registerById('people/stars/:id', this.people.stars)
    this.registerCollection('people/stars', this.people.stars)
  }
}
