import { SerializeOptions } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import type { User } from '@prisma/client'

export type CookieArgs = {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  options?: SerializeOptions
}

export type NextApiResponseWithCookie = NextApiResponse & {
  cookie: (args: CookieArgs) => void
}

export type NextApiHandlerWithCookie = (
  req: NextRequest,
  res: NextResponse
) => unknown | Promise<unknown>

export type CookiesMiddleware = (
  handler: NextApiHandlerWithCookie
) => (req: NextRequest, res: NextApiResponseWithCookie) => void

export type NextApiRequestWithUserId = NextApiRequest & {
  userId: string
}

export type NextApiHandlerWithUserId = (
  req: NextApiRequestWithUserId,
  res: NextApiResponse
) => unknown | Promise<unknown>

export type AuthGuardMiddleware = (
  handler: NextApiHandlerWithUserId
) => (req: NextApiRequestWithUserId, res: NextApiResponse) => void

export type UserResponseData = {
  user: Omit<User, 'password'>
  accessToken: string
}