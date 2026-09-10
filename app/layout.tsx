import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'TongueCare · Patient health follow-up', description: 'TongueCare patient prototype for guided tongue capture, health records and longitudinal reports' };
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
