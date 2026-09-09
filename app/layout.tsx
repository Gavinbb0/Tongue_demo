import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'TongueCare · Daily records and smarter visit preparation', description: 'TongueCare UI prototype with Basic and VIP health-journal experiences' };
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
