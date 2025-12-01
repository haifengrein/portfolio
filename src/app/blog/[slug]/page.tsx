import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostContent from '@/components/BlogPostContent';
import { getAllPosts, getPostBySlug } from '@/lib/markdown';

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The post you are looking for does not exist.'
    };
  }

  return {
    title: `${post.title} | Alex Chen`,
    description: post.summary
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="max-w-3xl mx-auto pt-24 pb-16 px-6">
        <Link href="/" className="mb-6 inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors">
          ← 返回首页 / Back Home
        </Link>
        {post && <BlogPostContent post={post} />}
      </main>
    </div>
  );
}
