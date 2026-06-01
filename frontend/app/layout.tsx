import localFont from 'next/font/local'
import './globals.css'

// ประกาศ Font โดยอ้างอิงไฟล์จาก public/fonts
const lineSeed = localFont({
  src: [
    {
      path: '../public/fonts/LINESeedSansTH_W_Rg.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/LINESeedSansTH_W_Bd.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/LINESeedSansTH_W_XBd.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-lineseed' // สร้าง CSS Variable เพื่อให้ Tailwind เรียกใช้
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${lineSeed.variable}`} suppressHydrationWarning> 
      <body className="font-lineseed" suppressHydrationWarning>{children}</body>
    </html>
  )
}
