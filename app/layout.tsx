import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: '舌康智能检测', description: '面向患者的舌象拍摄、智能分析与连续趋势记录原型' };
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="zh-CN"><body>{children}</body></html>; }
