import { PageModel, PageLink } from './PageModel'

export interface ResponseBase {
  timestamp: Date
}

export interface Response<T> extends ResponseBase {
  body: T
}

export interface ResponseCollection<T> extends ResponseBase {
  body: T[]
  page: number
  pages: PageLink[]
  skip: number
  take: number
  total: number
}

export interface ErrorResponse<T extends Error | string> extends ResponseBase {
  error: T
  message?: string
}

export function createResponse<T>(body: T): Response<T> {
  return { body, timestamp: new Date() }
}

export function createResponseCollection<T>(body: T[], page: PageModel): ResponseCollection<T> {
  return {
    body,
    skip: page.skip,
    take: page.take,
    total: page.total,
    page: page.page,
    pages: page.pages,
    timestamp: new Date(),
  }
}

export function createErrorResponse<T extends Error | string>(error: T, message?: string): ErrorResponse<T> {
  return { error, message, timestamp: new Date() }
}
