import checkFields from '@/utils/checkFields'
import prisma from '@/utils/prisma'
import { User } from '@prisma/client'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function POST (req: Request) {
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





    // возвращаем данные пользователя (без пароля!)
    // и токен доступа
    return new NextResponse(
      JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatarUrl: user.avatarUrl
        },
        accessToken
      }),

      { status: 200,
        headers: { 'Set-Cookie': `${process.env.COOKIE_NAME}=${idToken}`},
       }
    )
  } catch (e) {
    console.log(e)
    return new Response(
      JSON.stringify({ message: 'Something went wrong' }),
      { status: 500 }
    )
  }
}