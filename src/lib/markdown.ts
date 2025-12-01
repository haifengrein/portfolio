import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Language } from '@/data/siteData';

export type Post = {
  slug: string;
  title: string;
  date: string;
  lang: Language;
  summary: string;
  tags: string[];
  contentHtml: string;
  readTime: string;
};

const postsDirectory = path.join(process.cwd(), 'posts');

const ensurePostsDirectory = () => {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
};

const normalizeTags = (tags: unknown): string[] => {
  if (Array.isArray(tags)) return tags.map(String);
  if (typeof tags === 'string') return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  return [];
};

const calculateReadTime = (content: string): string => {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
};

export async function getPostBySlug(slug: string): Promise<Post | null> {
  ensurePostsDirectory();
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug: realSlug,
    title: (data.title as string) ?? realSlug,
    date: (data.date as string) ?? new Date().toISOString(),
    lang: ((data.lang as string) ?? 'en') as Language,
    summary: (data.summary as string) ?? '',
    tags: normalizeTags(data.tags),
    contentHtml,
    readTime: (data.readTime as string) ?? calculateReadTime(content)
  };
}

export async function getAllPosts(): Promise<Post[]> {
  ensurePostsDirectory();
  const fileNames = fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'));

  const posts = await Promise.all(fileNames.map((file) => getPostBySlug(file.replace(/\.md$/, ''))));
  const definedPosts = posts.filter(Boolean) as Post[];

  return definedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostsByLang(lang: Language): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.lang === lang);
}

export const getPostSlugs = (): string[] => {
  ensurePostsDirectory();
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
};

export { postsDirectory };
