import { Github, Linkedin, Mail } from 'lucide-react';
import { Content } from '@/data/siteData';
import SocialLink from './SocialLink';
import TechLogo from './TechLogo';

export type HeroProps = {
  content: Content;
  common: { email: string; github: string; linkedin: string };
};

const HERO_TECH_STACK = ['Python', 'FastAPI', 'Java', 'Spring Boot', 'C++', 'C', 'React', 'TypeScript', 'Docker'] as const;

const Hero = ({ content, common }: HeroProps) => (
  <section id="hero" className="pt-32 pb-16 md:pt-40 md:pb-20">
    <div className="flex items-center space-x-2 text-sm font-bold tracking-wider text-green-600 uppercase mb-6 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <span>{content.available}</span>
    </div>
    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-gray-900 leading-[1.1]">
      {content.name}
    </h1>
    <p className="text-xl md:text-2xl text-gray-500 max-w-2xl leading-relaxed font-light">
      {content.role}。{content.bio}
    </p>

    <div className="flex flex-wrap items-center gap-4 mt-10">
      <SocialLink href={common.github} icon={<Github size={18} />} label="GitHub" />
      <SocialLink href={common.linkedin} icon={<Linkedin size={18} />} label="LinkedIn" />
      <div className="flex items-center gap-3">
        <SocialLink href={`mailto:${common.email}`} icon={<Mail size={18} />} label="Email" />
        <div id="skills" className="flex items-center gap-2.5 overflow-x-auto max-w-full">
          {HERO_TECH_STACK.map((name) => (
            <span
              key={name}
              className="inline-flex items-center rounded-md p-1.5 hover:bg-gray-100 transition-colors"
              aria-label={name}
              title={name}
            >
              <TechLogo name={name} size={20} className="block" />
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
