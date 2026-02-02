import Link from 'next/link';
import { ReactNode } from 'react';

export type ProjectPageShellProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  backHref?: string;
  children: ReactNode;
};

const ProjectPageShell = ({ title, subtitle, actions, backHref = '/', children }: ProjectPageShellProps) => (
  <div className="min-h-screen bg-[#fafafa]">
    <main className="max-w-4xl mx-auto pt-24 pb-16 px-6">
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link href={backHref} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors">
          ← 返回首页 / Back Home
        </Link>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>

      <header className="mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 text-gray-900 tracking-tight">{title}</h1>
        {subtitle && <div className="text-base md:text-lg text-gray-500 leading-relaxed">{subtitle}</div>}
      </header>

      {children}
    </main>
  </div>
);

export default ProjectPageShell;
