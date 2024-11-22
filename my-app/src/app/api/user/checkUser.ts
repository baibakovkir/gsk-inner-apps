import prisma from '@/utils/prisma'
import jwt from 'jsonwebtoken'
import { NextApiHandler } from 'next'

const userHandler: NextApiHandler = async (req) => {
  // извлекаем токен идентификации из куки
  const idToken = req.cookies[process.env.COOKIE_NAME!]

  // если токен отсутствует
  if (!idToken) {
    return new Response(
      JSON.stringify({ message: 'ID token must be provided' }), { status: 401 })
  }

  try {
    // декодируем токен
    const decodedToken = (await jwt.verify(
      idToken,
      process.env.ID_TOKEN_SECRET!
    )) as unknown as { userId: string }

    // если полезная нагрузка отсутствует
    if (!decodedToken || !decodedToken.userId) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 })
    }

    // получаем данные пользователя
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      // важно!
      // не получаем пароль
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true
      }
    })

    // если данные отсутствуют
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 })
    }

    // генерируем токен доступа
    const accessToken = await jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: '1d'
      }
    )

    // возвращаем данные пользователя и токен доступа
    new Response(JSON.stringify({ user, accessToken }), { status: 200 })
  } catch (e) {
    console.log(e)
    new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 })
  }
}

export default userHandler