import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Haifeng Hou',
  description: 'Full-stack developer portfolio with blog, projects, and interactive GUI/Terminal modes built on Next.js and Tailwind CSS.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className="bg-[#fafafa] text-gray-900 font-sans">{children}</body>
    </html>
  );
}
