import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Evolve — Le système pour ton physique, ta discipline et ton avenir',
  description:
    'Evolve est un système complet — entraînement, coaching, application et suivi — pour construire un physique et une discipline qui tiennent dans la durée.',
  metadataBase: new URL('https://evolve-drab.vercel.app'),
  openGraph: {
    title: 'Evolve — Le système pour ton physique, ta discipline et ton avenir',
    description: 'Entraînement, coaching, application et suivi. Un système, pas une formation de plus.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Anton&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
