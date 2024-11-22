import { NextResponse } from 'next/server'
import { CookieArgs, CookiesMiddleware } from '../types'

const cookieFn = (
  res: NextResponse | { cookie: (args: CookieArgs) => void },
  { name, value, options = {} }: CookieArgs
) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  if (typeof options.maxAge === 'number') {
    options.expires = new Date(Date.now() + options.maxAge)
    options.maxAge /= 1000
  }

  // устанавливаем заголовок `Set-Cookie`
  const response = NextResponse.next()
  response.cookies.set(name, String(stringValue), options)
}

const cookies: CookiesMiddleware = (handler) => (req, res) => {
  // расширяем объект ответа
  res.cookie = (args) => cookieFn(res, args)

  // передаем управление следующему обработчику
  return handler(req, res)
}

export default cookies