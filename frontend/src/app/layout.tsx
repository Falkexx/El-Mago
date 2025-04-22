// app/layout.tsx
'use client';

import './globals.css';
import { Nunito } from 'next/font/google';

const nunito = Nunito({ subsets: ['latin'] });

export default function RootLayout({ children,  locale,
}: { children: React.ReactNode;   locale?: string;}) {
  return (
    <html lang={locale || 'en'}>
      <body className='fontDefault min-h-screen flex flex-col bg-[#111111]'>
        {children}
      </body>
    </html>
  );
}
