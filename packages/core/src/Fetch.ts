import fetch, { Request, RequestInit, Response } from 'node-fetch'

export function Fetch(request: string | Request, init?: RequestInit): Promise<Response> {
  return fetch(request, init)
}
