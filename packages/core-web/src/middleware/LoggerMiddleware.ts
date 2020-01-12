import { Lincoln } from '@sosus/core'
import { Request, Response, NextFunction, RequestHandler } from 'express'

export function LoggerMiddleware(logger: Lincoln): RequestHandler {
  const log = logger.extend('logger')

  return (req: Request, res: Response, next: NextFunction) => {
    log.debug(req.url, req.method, req.params, req.query)
    next()
  }
}
