import checkFields from '@/utils/checkFields'
import prisma from '@/utils/prisma'
import { User } from '@prisma/client'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'


export async function POST(req: NextRequest) {
  // извлекаем данные из тела запроса
  // одним из преимуществ использования Prisma является автоматическая генерация типов моделей
  const data: Pick<User, 'username' | 'email' | 'password'> = (
    await req.json()
  )

  // если отсутствует хотя бы одно обязательное поле
  if (!checkFields(data, ['email', 'password'])) {
    return new Response(
      JSON.stringify({ message: 'Some required fields are missing' }),
      { status: 400 }
    )
  }

  try {
    // получаем данные пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    // если данные имеются, значит, пользователь уже зарегистрирован
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'User already exists' }),
        { status: 409 }
      )
    }

    // хэшируем пароль
    const passwordHash = await argon2.hash(data.password)
    // и заменяем им оригинальный
    data.password = passwordHash

    // создаем пользователя - записываем учетные данные пользователя в БД
    const newUser = await prisma.user.create({
      data,
      // важно!
      // не "выбираем" пароль
      select: {
        id: true,
        username: true,
        email: true
      }
    })

    // генерируем токен идентификации на основе ID пользователя
    const idToken = await jwt.sign(
      { userId: newUser.id },
      process.env.ID_TOKEN_SECRET!,
      {
        // срок жизни токена, т.е. время, в течение которого токен будет считаться валидным составляет 7 дней
        expiresIn: '7d'
      }
    )

    // генерируем токен доступа на основе ID пользователя
    const accessToken = await jwt.sign(
      { userId: newUser.id },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        // важно!
        // такой срок жизни токена доступа приемлем только при разработке приложения
        // см. ниже
        expiresIn: '1d'
      }
    )

    // возвращаем данные пользователя и токен доступа
    return new Response(
      JSON.stringify({ user: newUser, accessToken }),
      { status: 201,
        headers: { 'Set-Cookie': `${process.env.COOKIE_NAME}=${idToken}, HttpOnly, Max-Age=604800, Path=/, SameSite=Strict, Secure` }
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