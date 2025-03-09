'use client'
import Header from '@/app/components/Header'
import Footer from './components/Footer'
import 'normalize.css'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
})
 {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}

