import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import TurboSortCudaPage from '@/components/projects/TurboSortCudaPage';
import BurdellsDogsModernizationPage from '@/components/projects/BurdellsDogsModernizationPage';
import DfsObservabilityStackPage from '@/components/projects/DfsObservabilityStackPage';
import ProjectFallbackPage from '@/components/projects/ProjectFallbackPage';
import { DATA } from '@/data/siteData';

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = new Set<string>();
  for (const project of [...DATA.zh.projects, ...DATA.en.projects]) slugs.add(project.slug);
  return [...slugs].map((slug) => ({ slug }));
}

const getProjectBySlug = (slug: string) => {
  const projectZh = DATA.zh.projects.find((p) => p.slug === slug) ?? null;
  const projectEn = DATA.en.projects.find((p) => p.slug === slug) ?? null;
  return { projectZh, projectEn };
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { projectEn, projectZh } = getProjectBySlug(params.slug);

  if (!projectZh || !projectEn) {
    return { title: 'Project Not Found' };
  }

  return {
    title: `${projectEn.title} | ${DATA.en.name}`,
    description: projectEn.desc
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const { projectZh, projectEn } = getProjectBySlug(params.slug);

  if (!projectZh || !projectEn) {
    notFound();
  }

  if (params.slug === 'turbosort-cuda') {
    return <TurboSortCudaPage />;
  }

  if (params.slug === 'burdells-dogs-modernization') {
    return <BurdellsDogsModernizationPage projectZh={projectZh} projectEn={projectEn} />;
  }

  if (params.slug === 'dfs-observability-stack') {
    return (
      <DfsObservabilityStackPage
        githubUrl={projectZh.githubUrl}
        deepwikiUrl={projectZh.deepwikiUrl}
        deployUrl={projectZh.deployUrl}
      />
    );
  }

  return <ProjectFallbackPage projectZh={projectZh} projectEn={projectEn} />;
}
