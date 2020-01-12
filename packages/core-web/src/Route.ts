import { Express, RequestHandler } from 'express'

export interface IRouteCollection {
  [key: string]: RequestHandler
}

export interface IRoute {
  register(): void
}

export abstract class Route implements IRoute {
  constructor(protected readonly router: Express) {}

  abstract register(): void

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

export const AppType = Symbol('Express')
export const RouterType = Symbol('Router')
export const RouteCollectionType = Symbol('RouteCollection')
