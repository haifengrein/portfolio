import Image from 'next/image';

export type TechLogoProps = {
  name: string;
  size?: number;
  className?: string;
};

const ICONS: Record<string, { slug: string; color: string }> = {
  Python: { slug: 'python', color: '3776AB' },
  FastAPI: { slug: 'fastapi', color: '009688' },
  Java: { slug: 'openjdk', color: 'F89820' },
  'Spring Boot': { slug: 'springboot', color: '6DB33F' },
  'C++': { slug: 'cplusplus', color: '00599C' },
  C: { slug: 'c', color: 'A8B9CC' },
  React: { slug: 'react', color: '61DAFB' },
  TypeScript: { slug: 'typescript', color: '3178C6' },
  Docker: { slug: 'docker', color: '2496ED' }
};

export default function TechLogo({ name, size = 32, className }: TechLogoProps) {
  const icon = ICONS[name];

  if (!icon) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded bg-gray-200 text-gray-700 font-bold text-xs ${className}`}
        style={{ width: size, height: size }}
        title={name}
      >
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <Image
      src={`https://cdn.simpleicons.org/${icon.slug}/${icon.color}`}
      width={size}
      height={size}
      alt={name}
      className={className}
      unoptimized
    />
  );
}
