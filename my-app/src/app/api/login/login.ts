import { NextApiHandlerWithCookie } from '@/types'
import checkFields from '@/utils/checkFields'
import cookies from '@/utils/cookie'
import prisma from '@/utils/prisma'
import { User } from '@prisma/client'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

const loginHandler: NextApiHandlerWithCookie = async (req, res) => {
  const data: Pick<User, 'email' | 'password'> = await req.json()

  if (!checkFields(data, ['email', 'password'])) {
    return new Response(
      JSON.stringify({ message: 'Some required fields are missing' }),
      { status: 400 }
    )
  }

  try {
    // получаем данные пользователя
    const user = await prisma.user.findUnique({
      where: {
        email: data.email
      },
      // важно!
      // здесь нам нужен пароль
      select: {
        id: true,
        email: true,
        password: true,
        username: true,
        avatarUrl: true
      }
    })

    // если данные отсутствуют
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      )
    }

    // проверяем пароль
    const isPasswordCorrect = await argon2.verify(user.password, data.password)

    // если введен неправильный пароль
    if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({ message: 'Invalid password' }),
        { status: 403 }
      )
    }

    // генерируем токен идентификации
    const idToken = await jwt.sign(
      { userId: user.id },
      process.env.ID_TOKEN_SECRET!,
      {
        expiresIn: '7d'
      }
    )

    // генерируем токен доступа
    const accessToken = await jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: '1d'
      }
    )

    // записываем токен идентификации в куки
    res.cookie({
      name: process.env.COOKIE_NAME!,
      value: idToken,
      options: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/',
        sameSite: true,
        secure: true
      }
    })

    // возвращаем данные пользователя (без пароля!)
    // и токен доступа
    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatarUrl: user.avatarUrl
        },
        accessToken
      }),
      { status: 200 }
    )
  } catch (e) {
    console.log(e)
    return new Response(
      JSON.stringify({ message: 'Something went wrong' }),
      { status: 500 }
    )
  }
}

export default cookies(loginHandler)