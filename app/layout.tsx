import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'TongueCare · A little care, every day', description: 'TongueCare Basic: a daily tongue photo and health journal UI prototype' };
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
