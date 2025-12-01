import PortfolioPage from '@/components/PortfolioPage';
import { getAllPosts } from '@/lib/markdown';

export default async function HomePage() {
  const posts = await getAllPosts();
  return <PortfolioPage posts={posts} />;
}
