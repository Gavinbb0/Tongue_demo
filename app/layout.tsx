import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: '舌康记 · 每一天，都有迹可循', description: '舌康记普通版：日常舌象记录与健康档案界面原型' };
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="zh-CN"><body>{children}</body></html>; }
