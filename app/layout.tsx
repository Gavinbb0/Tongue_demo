import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: '舌康舌象记录', description: '面向患者的舌象拍摄、长期记录与辅助就医原型' };
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="zh-CN"><body>{children}</body></html>; }
