import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'TongueCare', description: 'A patient-facing prototype for tongue photography, longitudinal records, and visit preparation' };
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
