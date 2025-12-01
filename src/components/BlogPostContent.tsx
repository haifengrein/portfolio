import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Post } from '@/lib/markdown';

export type BlogPostContentProps = {
  post: Post;
  variant?: 'gui' | 'terminal';
  backLabel?: string;
  onBack?: () => void;
};

const BlogPostContent = ({ post, variant = 'gui', backLabel, onBack }: BlogPostContentProps) => {
  const isTerminal = variant === 'terminal';

  return (
    <article
      className={
        isTerminal
          ? 'border border-green-700 p-6 bg-black shadow-[0_0_20px_rgba(0,255,0,0.05)]'
          : 'max-w-3xl mx-auto pt-8 pb-12 px-6'
      }
    >
      {onBack && backLabel && !isTerminal && (
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
        >
          <ArrowLeft size={16} className="mr-2" /> {backLabel}
        </button>
      )}

      <div className={`${isTerminal ? 'border-b border-green-800 pb-4 mb-6 flex justify-between items-end' : 'mb-10 text-center'}`}>
        {isTerminal ? (
          <>
            <h1 className="text-xl md:text-2xl font-bold text-white">{post.title}</h1>
            <div className="text-xs text-green-600">
              {post.date} | {post.readTime}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center text-sm text-gray-400 mb-6 space-x-4">
              <span className="flex items-center">
                <Calendar size={14} className="mr-1.5" /> {post.date}
              </span>
              <span className="flex items-center">
                <Clock size={14} className="mr-1.5" /> {post.readTime}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6 text-gray-900 tracking-tight">{post.title}</h1>
          </>
        )}
      </div>

      <div
        className={
          isTerminal
            ? 'prose prose-invert prose-green max-w-none prose-p:opacity-80 prose-headings:text-green-400'
            : 'prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-h3:text-xl prose-a:text-blue-600 hover:prose-a:text-blue-500'
        }
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {onBack && backLabel && isTerminal && (
        <div className="mt-12 pt-4 border-t border-green-900 border-dashed text-center">
          <button
            onClick={onBack}
            className="hover:bg-green-500 hover:text-black px-4 py-2 border border-green-500 transition-all font-bold"
          >
            {backLabel}
          </button>
        </div>
      )}
    </article>
  );
};

export default BlogPostContent;
