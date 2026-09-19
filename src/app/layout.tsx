import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Evolve — Le programme musculation & remise en forme',
  description:
    'Evolve est un programme structuré pour transformer ton corps : entraînement, nutrition et suivi, pensés pour tenir sur la durée.',
  metadataBase: new URL('https://evolve-drab.vercel.app'),
  openGraph: {
    title: 'Evolve — Le programme musculation & remise en forme',
    description: 'Entraînement, nutrition et suivi. Une méthode, pas un coup de motivation.',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
