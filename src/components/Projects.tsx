import { ExternalLink, Globe } from 'lucide-react';
import { Project } from '@/data/siteData';

export type ProjectsProps = {
  title: string;
  projects: Project[];
};

const Projects = ({ title, projects }: ProjectsProps) => (
  <section id="projects" className="py-16 border-t border-gray-100 mb-12">
    <div className="flex items-center mb-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="h-px bg-gray-200 flex-grow ml-4" />
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      {projects.map((project) => (
        <div
          key={project.title}
          className="bg-white rounded-xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100/50 hover:shadow-lg transition-all flex flex-col justify-between h-full"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gray-50 p-2 rounded-lg">
                <Globe size={20} />
              </div>
              <ExternalLink size={18} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
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

export default Projects;
