import { ReactNode } from 'react';

export type SocialLinkProps = {
  href: string;
  icon: ReactNode;
  label: string;
  variant?: 'gui' | 'terminal';
};

const SocialLink = ({ href, icon, label, variant = 'gui' }: SocialLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`flex items-center space-x-2 transition-colors ${
      variant === 'gui'
        ? 'text-gray-500 hover:text-black bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full'
        : 'text-green-500 hover:text-green-100 hover:underline'
    }`}
  >
    {icon} <span className="font-medium text-sm">{label}</span>
  </a>
);

export default SocialLink;
