import { Github, Globe } from 'lucide-react';
import Image from 'next/image';

export type ProjectExternalLinksProps = {
  githubUrl?: string;
  deepwikiUrl?: string;
  colabUrl?: string;
  deployUrl?: string;
  showPlaceholders?: boolean;
  variant?: 'card' | 'page';
};

const ProjectExternalLinks = ({ githubUrl, deepwikiUrl, colabUrl, deployUrl, showPlaceholders = false, variant = 'page' }: ProjectExternalLinksProps) => {
  const iconClassName =
    variant === 'card'
      ? 'inline-flex items-center rounded-md bg-white/80 hover:bg-white border border-gray-200 px-2 py-1 text-gray-700 transition-colors'
      : 'inline-flex items-center rounded-full bg-gray-100 hover:bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors';

  const badgeClassName =
    variant === 'card'
      ? 'inline-flex items-center rounded-md bg-white/80 hover:bg-white border border-gray-200 px-2 py-1 transition-colors'
      : 'inline-flex items-center rounded-full bg-gray-100 hover:bg-gray-200 px-3 py-1.5 transition-colors';

  return (
    <div className="flex items-center gap-2">
      {deployUrl && (
        <a
          href={deployUrl}
          target="_blank"
          rel="noreferrer"
          className={iconClassName}
          aria-label="Live Site"
          title="Live Site"
        >
          <Globe size={variant === 'card' ? 16 : 14} />
        </a>
      )}
      {deepwikiUrl ? (
        <a
          href={deepwikiUrl}
          target="_blank"
          rel="noreferrer"
          className={badgeClassName}
          aria-label="DeepWiki"
          title="DeepWiki"
        >
          <Image
            src="https://deepwiki.com/badge.svg"
            alt="Ask DeepWiki"
            width={110}
            height={20}
            className={variant === 'card' ? 'h-4 w-auto' : 'h-5 w-auto'}
            unoptimized
          />
        </a>
      ) : (
        showPlaceholders &&
        !colabUrl && (
          <span
            className={`${badgeClassName} opacity-40 cursor-not-allowed`}
            aria-label="DeepWiki (TBD)"
            title="DeepWiki (TBD)"
          >
            <Image
              src="https://deepwiki.com/badge.svg"
              alt="Ask DeepWiki"
              width={110}
              height={20}
              className={variant === 'card' ? 'h-4 w-auto' : 'h-5 w-auto'}
              unoptimized
            />
          </span>
        )
      )}
      {colabUrl && (
        <a
          href={colabUrl}
          target="_blank"
          rel="noreferrer"
          className={badgeClassName}
          aria-label="Open In Colab"
          title="Open In Colab"
        >
          <Image
            src="https://colab.research.google.com/assets/colab-badge.svg"
            alt="Open In Colab"
            width={110}
            height={20}
            className={variant === 'card' ? 'h-4 w-auto' : 'h-5 w-auto'}
            unoptimized
          />
        </a>
      )}
      {githubUrl ? (
        <a href={githubUrl} target="_blank" rel="noreferrer" className={iconClassName} aria-label="GitHub" title="GitHub">
          <Github size={variant === 'card' ? 16 : 14} />
        </a>
      ) : (
        showPlaceholders && (
          <span
            className={`${iconClassName} opacity-40 cursor-not-allowed`}
            aria-label="GitHub (TBD)"
            title="GitHub (TBD)"
          >
            <Github size={variant === 'card' ? 16 : 14} />
          </span>
        )
      )}
    </div>
  );
};

export default ProjectExternalLinks;
