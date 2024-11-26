import { NextResponse } from "next/server"


export async function GET(): Promise<NextResponse> {
  // извлекаем токен идентификации из куки
  
  try {
    return new NextResponse(
      JSON.stringify({ message: 'You have been logged out' }),
      { status: 201,
        headers: { 'Set-Cookie': `${process.env.COOKIE_NAME}='', HttpOnly, Max-Age=604800, Path=/, SameSite=Strict, Secure` }
      }
    )
  } catch (e) {
    console.log(e)
    return new NextResponse(
      JSON.stringify({ message: 'Something went wrong' }),
      { status: 500 }
    )
  }
}
