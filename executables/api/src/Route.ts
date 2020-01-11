import { Router, RequestHandler } from 'express'

export interface IRoute {}

export abstract class Route implements IRoute {
  constructor(protected readonly router: Router) {}

  protected delete(path: string, handler: RequestHandler) {
    return this.router.delete(path, handler)
  }

  protected get(path: string, handler: RequestHandler) {
    return this.router.get(path, handler)
  }

  protected head(path: string, handler: RequestHandler) {
    return this.router.head(path, handler)
  }

  protected post(path: string, handler: RequestHandler) {
    return this.router.post(path, handler)
  }

  protected put(path: string, handler: RequestHandler) {
    return this.router.put(path, handler)
  }
}

export const RouterType = Symbol('Router')
export const RouteCollectionType = Symbol('RouteCollection')
