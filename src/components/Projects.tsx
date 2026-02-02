'use client';

import { Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Language, Project } from '@/data/siteData';
import ProjectExternalLinks from './projects/ProjectExternalLinks';

export type ProjectsProps = {
  title: string;
  projects: Project[];
  lang: Language;
};

const Projects = ({ title, projects, lang }: ProjectsProps) => {
  const router = useRouter();

  const toProjectHref = (pathname: string) => {
    const params = new URLSearchParams({ lang });
    return `${pathname}?${params.toString()}`;
  };

  const openProject = (project: Project) => {
    const externalUrl = project.deepwikiUrl ?? project.githubUrl;
    if (externalUrl) {
      window.location.assign(externalUrl);
      return;
    }

    router.push(toProjectHref(`/projects/${project.slug}`));
  };

  return (
    <section id="projects" className="py-10 border-t border-gray-100">
      <div className="flex items-center mb-5">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="h-px bg-gray-200 flex-grow ml-4" />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {projects.map((project) => (
          <div
            key={project.title}
            role="link"
            tabIndex={0}
            onClick={() => openProject(project)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') openProject(project);
            }}
            className="relative bg-white rounded-xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100/50 hover:shadow-lg transition-all flex flex-col justify-between h-full cursor-pointer outline-none focus:ring-2 focus:ring-gray-900/15"
          >
            <div
              className="absolute top-4 right-4"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <ProjectExternalLinks
                githubUrl={project.githubUrl}
                deepwikiUrl={project.deepwikiUrl}
                colabUrl={project.colabUrl}
                deployUrl={project.deployUrl}
                showPlaceholders={Boolean(project.reserveExternalLinks)}
                variant="card"
              />
            </div>

            <div>
              <div className="flex items-start mb-4">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <Globe size={20} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 pr-24">{project.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{project.desc}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
