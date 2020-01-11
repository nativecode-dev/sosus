import { Request } from 'express'

export interface PageLink {
  index: number
  skip: number
  take: number
}

export interface PageModel {
  page: number
  pages: PageLink[]
  skip: number
  take: number
  total: number
}

export type ValueType = number | string

function floatstr(value: string): boolean {
  return /[\d+\.\d+]+/g.test(value)
}

function numstr(value: string): boolean {
  return /\d+/g.test(value)
}

function getValue<T extends ValueType>(value: string): T {
  if (floatstr(value)) {
    return parseFloat(value) as T
  }

  if (numstr(value)) {
    return parseInt(value, 0) as T
  }

  return value as T
}

function links(pages: number, take: number): PageLink[] {
  return [...Array(pages).keys()].map((_, index) => {
    const page = index + 1
    return { index: page, take, skip: index * take }
  })
}

export function getParam<T extends ValueType>(req: Request, key: string, defaults: T): T {
  const value = req.params[key]
  if (value) return getValue(value)
  return defaults
}

export function getQuery<T extends ValueType>(req: Request, key: string, defaults: T): T {
  const value = req.query[key]
  if (value) return getValue(value)
  return defaults
}

export function getSkipTake(req: Request) {
  const skip = getParam<number>(req, 'skip', getQuery<number>(req, 'skip', 0))
  const take = getParam<number>(req, 'take', getQuery<number>(req, 'take', 20))
  return { skip, take }
}

export function pagination(req: Request, total: number): PageModel {
  const skip = getParam<number>(req, 'skip', getQuery<number>(req, 'skip', 0))
  const take = getParam<number>(req, 'take', getQuery<number>(req, 'take', 20))

  const count = Math.floor(total / take)
  const page = Math.floor(skip / take) + 1
  const pages = total % take === 0 ? count : count + 1

  return { page, skip, take, total, pages: links(pages, take) }
}
