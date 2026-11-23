import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Baihaqi OS — Portfolio Linux Desktop',
  description:
    'Portofolio interaktif bergaya sistem operasi Linux modern milik Baihaqi — Web Developer & AI Automation Specialist.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Red+Hat+Text:wght@500;600;700&family=Ubuntu:wght@400;500&family=Spline+Sans+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-surface text-dark-on-surface font-body antialiased selection:bg-dark-primary selection:text-dark-on-primary">
        {children}
      </body>
    </html>
  );
}
