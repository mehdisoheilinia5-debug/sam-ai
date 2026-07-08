import type { Metadata } from 'next'
import './globals.css'

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
      <head>
        {/*
          Sets --app-height to the *real* visible viewport height in px,
          recalculated on resize / orientation change / browser toolbar
          show-hide. This is more reliable than 100vh or 100dvh alone,
          which can leave a gap or clip content on some mobile browsers
          before the first scroll happens.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                function setAppHeight() {
                  var h = window.visualViewport ? window.visualViewport.height : window.innerHeight;
                  document.documentElement.style.setProperty('--app-height', h + 'px');
                }
                setAppHeight();
                window.addEventListener('resize', setAppHeight);
                window.addEventListener('orientationchange', setAppHeight);
                if (window.visualViewport) {
                  window.visualViewport.addEventListener('resize', setAppHeight);
                }
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
