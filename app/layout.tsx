import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'AI TACT - AI High-Stakes Message Auditor',
  description: 'Powerful AI auditing for high-stakes messages. Analyze tone, cultural context, and social risks before you send your business or personal emails. Free tool.',
  keywords: ['AI email assistant', 'message auditor', 'tone checker', 'email analyzer', 'business communication', 'AI writing tool', 'tactful communication', 'AI proofreader'],
  authors: [{ name: 'AI TACT Suite' }],
  openGraph: {
    title: 'AI TACT - AI High-Stakes Message Auditor',
    description: 'Analyze the tone, social risk, and cultural impact of your high-stakes messages with AI.',
    url: 'https://ais-pre-uvictxmrc6afwjgea4qac5-259171141265.europe-west1.run.app',
    siteName: 'AI TACT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI TACT - AI High-Stakes Message Auditor',
    description: 'Don\'t let a misunderstood tone ruin a deal. Analyze your messages instantly.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-black text-white font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
