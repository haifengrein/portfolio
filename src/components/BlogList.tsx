import { Post } from '@/lib/markdown';
import BlogPostCard from './BlogPostCard';

export type BlogListProps = {
  title: string;
  posts: Post[];
  ctaLabel: string;
  onSelect: (post: Post) => void;
};

const BlogList = ({ title, posts, ctaLabel, onSelect }: BlogListProps) => (
  <section id="blog" className="py-16 border-t border-gray-100">
    <div className="flex items-center mb-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="h-px bg-gray-200 flex-grow ml-4" />
    </div>
    <div className="grid gap-6">
      {posts.map((post) => (
        <BlogPostCard key={post.slug} post={post} ctaLabel={ctaLabel} onSelect={onSelect} />
      ))}
    </div>
  </section>
);

export default BlogList;
