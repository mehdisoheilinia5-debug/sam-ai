import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SAM AI | دستیار هنری هوش مصنوعی',
  description: 'دستیار شخصی هوش مصنوعی برای هنرمندان تئاتر',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}