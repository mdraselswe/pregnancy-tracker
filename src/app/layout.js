import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'প্রেগন্যান্সি ট্র্যাকার',
  description: 'আমাদের ছোট্ট অতিথির জন্য অপেক্ষা',
  manifest: '/manifest.json', // manifest ফাইল লিঙ্ক করা হলো
  themeColor: '#EC4899', // থিম কালার যোগ করা হলো
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
