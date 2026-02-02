'use client';

import { useEffect, useMemo, useState } from 'react';

import { Project } from '@/data/siteData';
import ProjectExternalLinks from './ProjectExternalLinks';
import ProjectPageShell from './ProjectPageShell';

type Lang = 'zh' | 'en';

const PROJECT_INTRO: Record<Lang, string> = {
  en: 'The project started as a legacy deliverable: a functional but fragile Flask application connected to a database via raw, unmanaged SQL strings. While it met the basic requirements, it lacked the resilience, scalability, and developer experience (DX) required for a production environment.',
  zh: '项目最初是一个“能用但脆弱”的遗留交付物：Flask 应用通过分散且未管理的原始 SQL 字符串直连数据库。它满足了基本需求，但缺少生产环境所需的韧性、可扩展性与开发体验（DX）。'
};

const HYBRID_DATA_LAYER: Record<Lang, string> = {
  en: 'While SQLModel handles CRUD beautifully, complex analytics (like the Animal Control Report) were unreadable in Python DSL. I adopted a hybrid approach: using Raw SQL for complex aggregations mapped to Pydantic DTOs. This delivers the performance of SQL with the type safety of an API.',
  zh: 'SQLModel 很适合处理常规 CRUD，但复杂分析（例如 Animal Control Report）用 Python DSL 写起来可读性很差。我采用混合方案：复杂聚合用 Raw SQL 编写，并映射到 Pydantic DTO。这样既保留了 SQL 的性能，也获得了 API 的类型安全。'
};

export type BurdellsDogsModernizationPageProps = {
  projectZh: Project;
  projectEn: Project;
};

const BurdellsDogsModernizationPage = ({ projectZh, projectEn }: BurdellsDogsModernizationPageProps) => {
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
  const backHref = `/?lang=${lang}`;

  const toggleLang = () => {
    const nextLang: Lang = lang === 'en' ? 'zh' : 'en';
    setLang(nextLang);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', nextLang);
    window.history.replaceState({}, '', url.toString());
  };

  const badges = useMemo(() => primary.tags, [primary.tags]);

  return (
    <ProjectPageShell
      backHref={backHref}
      title={primary.title}
      subtitle={
        <div className="space-y-4">
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">{primary.desc}</p>
          <div className="flex flex-wrap gap-2">
            {badges.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      }
      actions={
        <div className="flex items-center gap-2">
          <ProjectExternalLinks
            githubUrl={primary.githubUrl}
            deepwikiUrl={primary.deepwikiUrl}
            deployUrl={primary.deployUrl}
            showPlaceholders={Boolean(primary.reserveExternalLinks)}
            variant="page"
          />
          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex items-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 text-xs font-semibold transition-colors"
          >
            {lang === 'en' ? '中' : 'EN'}
          </button>
        </div>
      }
    >
      <section className="py-10 border-t border-gray-100">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold">{lang === 'en' ? 'The Challenge' : '项目挑战'}</h2>
          <div className="h-px bg-gray-200 flex-grow ml-4" />
        </div>

        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">{PROJECT_INTRO[lang]}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-red-100 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-bold tracking-wider text-red-700 uppercase mb-3">{lang === 'en' ? 'Before (Legacy)' : '改造前 (Legacy)'}</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>❌ “Works on my machine” deployment</li>
              <li>❌ Raw SQL strings scattered in code</li>
              <li>❌ Blocking I/O (Synchronous Flask)</li>
              <li>❌ No Tests, No CI/CD</li>
              <li>❌ Server-side template coupling (Jinja2)</li>
            </ul>
          </div>

          <div className="bg-white border border-green-100 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-bold tracking-wider text-green-700 uppercase mb-3">{lang === 'en' ? 'After (Modern)' : '改造后 (Modern)'}</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✅ Dockerized & cloud-ready</li>
              <li>✅ SQLModel (ORM) + Pydantic validation</li>
              <li>✅ Non-blocking I/O (Async FastAPI)</li>
              <li>✅ CI guardrails (lint/test/build)</li>
              <li>✅ Gradual migration via Strangler Fig</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-10 border-t border-gray-100">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold">{lang === 'en' ? 'Architecture' : '架构方案'}</h2>
          <div className="h-px bg-gray-200 flex-grow ml-4" />
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <pre className="text-xs md:text-sm font-mono text-gray-700 overflow-x-auto leading-relaxed">
{`[ User Browser ]
      │
      ▼
[ Nginx / Traefik ] ──┐
      │               │
      ▼               ▼
[ Flask (Legacy) ] [ FastAPI (Modern) ]
(UI / HTML)        (API / Auth / Data)
      │               │
      └───────┬───────┘
              ▼
      [ MySQL 8.0 ]
              │
      [ Docker Volume ]`}
          </pre>
          <p className="mt-4 text-sm text-gray-500">{lang === 'en' ? 'Hybrid state: both systems run in parallel.' : '混合态：新旧系统并行运行，逐步迁移。'}</p>
        </div>
      </section>

      <section className="py-10 border-t border-gray-100">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold">{lang === 'en' ? 'Engineering Decisions' : '关键工程决策'}</h2>
          <div className="h-px bg-gray-200 flex-grow ml-4" />
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h3 className="font-bold text-lg mb-2">A. {lang === 'en' ? 'The Async Bet' : '异步化选择'}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {lang === 'en'
                ? 'Chose async Python (FastAPI) for concurrency and future integrations, trading off complexity in data-loading and testing.'
                : '选择异步 FastAPI 以提升并发与扩展能力，同时接受数据加载与测试复杂度上升的成本。'}
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto font-mono text-xs md:text-sm border border-gray-800">
              <pre>{`# ❌ BAD (Sync mindset): Implicitly triggers blocking I/O
# Fails with "MissingGreenlet" error
query = select(Dog)
result = await session.exec(query)

# ✅ GOOD (Async mindset): Explicit Eager Loading
# Fetches all data in one non-blocking query
query = select(Dog).options(selectinload(Dog.breeds))
result = await session.exec(query)`}</pre>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h3 className="font-bold text-lg mb-2">B. {lang === 'en' ? 'Hybrid Data Layer (ORM + Raw SQL)' : '数据层混合策略 (ORM + Raw SQL)'}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{HYBRID_DATA_LAYER[lang]}</p>
          </div>
        </div>
      </section>

      <section className="py-10 border-t border-gray-100">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold">{lang === 'en' ? 'Security Pitfall' : '安全踩坑'}</h2>
          <div className="h-px bg-gray-200 flex-grow ml-4" />
        </div>

        <div className="bg-white border border-yellow-100 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <p className="text-sm text-gray-700 leading-relaxed">
            {lang === 'en'
              ? 'Hybrid SSO failed due to configuration drift: Flask used env SECRET_KEY while FastAPI silently used a fallback. Fix: enforce a single source of truth for secrets and crash on missing config.'
              : '混合 SSO 因配置漂移而失败：Flask 读取环境变量，FastAPI 使用了 fallback。修复：统一配置源，并在缺失关键配置时直接失败。'}
          </p>
        </div>
      </section>

    </ProjectPageShell>
  );
};

export default BurdellsDogsModernizationPage;
