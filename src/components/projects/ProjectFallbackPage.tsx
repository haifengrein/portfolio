'use client';

import { useEffect, useState } from 'react';

import { Project } from '@/data/siteData';
import ProjectPageShell from './ProjectPageShell';
import ProjectExternalLinks from './ProjectExternalLinks';

type Lang = 'zh' | 'en';

export type ProjectFallbackPageProps = {
  projectZh: Project;
  projectEn: Project;
};

const ProjectFallbackPage = ({ projectZh, projectEn }: ProjectFallbackPageProps) => {
  const [lang, setLang] = useState<Lang>('zh');

  useEffect(() => {
    const readLang = () => {
      const params = new URLSearchParams(window.location.search);
      const nextLang: Lang = params.get('lang') === 'en' ? 'en' : 'zh';
      setLang((prev) => (prev === nextLang ? prev : nextLang));
    };

    readLang();
    window.addEventListener('popstate', readLang);
    return () => window.removeEventListener('popstate', readLang);
  }, []);

  const primary = lang === 'en' ? projectEn : projectZh;
  const secondary = lang === 'en' ? projectZh : projectEn;
  const backHref = `/?lang=${lang}`;

  return (
    <ProjectPageShell
      backHref={backHref}
      title={primary.title}
      subtitle={
        <div className="space-y-2">
          <p>{primary.desc}</p>
          <p className="text-sm text-gray-400">{secondary.desc}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {projectZh.tags.map((tag) => (
              <span key={tag} className="text-xs font-mono text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      }
      actions={
        <div className="flex items-center gap-2">
          <ProjectExternalLinks
            githubUrl={projectZh.githubUrl}
            deepwikiUrl={projectZh.deepwikiUrl}
            deployUrl={projectZh.deployUrl}
            showPlaceholders={Boolean(projectZh.reserveExternalLinks)}
            variant="page"
          />
          <button
            type="button"
            onClick={() => {
              const nextLang: Lang = lang === 'en' ? 'zh' : 'en';
              setLang(nextLang);
              const url = new URL(window.location.href);
              url.searchParams.set('lang', nextLang);
              window.history.replaceState({}, '', url.toString());
            }}
            className="inline-flex items-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 text-xs font-semibold transition-colors"
          >
            {lang === 'en' ? '中' : 'EN'}
          </button>
        </div>
      }
    >
      <section className="py-10 border-t border-gray-100">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-sm text-gray-600">
          {lang === 'en'
            ? 'This project page is being expanded. Share the project write-up (architecture, key decisions, benchmarks, screenshots), and I will adapt it to the current site style.'
            : '该项目详情页正在补充中。你可以先在首页查看项目简介，或稍后把该项目的介绍内容（如架构图/关键决策/性能数据/截图）发我，我会按当前站点风格整理成完整页面。'}
        </div>
      </section>
    </ProjectPageShell>
  );
};

export default ProjectFallbackPage;
