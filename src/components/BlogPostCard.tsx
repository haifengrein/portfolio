import { ArrowLeft, Calendar, Clock, Hash } from 'lucide-react';
import { Post } from '@/lib/markdown';

export type BlogPostCardProps = {
  post: Post;
  ctaLabel: string;
  onSelect: (post: Post) => void;
};

const BlogPostCard = ({ post, ctaLabel, onSelect }: BlogPostCardProps) => (
  <div
    onClick={() => onSelect(post)}
    className="cursor-pointer bg-white p-8 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100/50 hover:shadow-md hover:border-gray-300 transition-all group relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-1 h-full bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
    <div className="flex items-center text-xs font-semibold tracking-wider text-gray-400 uppercase mb-3">
      <span className="flex items-center">
        <Calendar size={12} className="mr-1.5" /> {post.date}
      </span>
      <span className="mx-2">•</span>
      <span className="flex items-center">
        <Clock size={12} className="mr-1.5" /> {post.readTime}
      </span>
    </div>
    <h3 className="text-xl font-bold mb-3 group-hover:text-black transition-colors">{post.title}</h3>
    <p className="text-gray-500 leading-relaxed">{post.summary}</p>
    {post.tags.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-4">
        {post.tags.map((tag) => (
          <span key={tag} className="inline-flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
            <Hash size={12} className="mr-1" />
            {tag}
          </span>
        ))}
      </div>
    )}
    <div className="mt-5 text-sm font-semibold text-black flex items-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
      {ctaLabel} <ArrowLeft size={16} className="ml-2 rotate-180" />
    </div>
  </div>
);

export default BlogPostCard;
