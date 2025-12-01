import { Code, Cpu, Layers } from 'lucide-react';
import { Skill } from '@/data/siteData';

export type SkillsProps = {
  title: string;
  skills: Skill[];
};

const Skills = ({ title, skills }: SkillsProps) => (
  <section id="skills" className="py-16 border-t border-gray-100">
    <div className="flex items-center mb-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="h-px bg-gray-200 flex-grow ml-4" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {skills.map((skill) => (
        <div
          key={skill.name}
          className="bg-white p-6 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100/50 hover:border-gray-200 transition-all"
        >
          <div className="text-gray-800 mb-4 bg-gray-50 w-10 h-10 flex items-center justify-center rounded-lg">
            {skill.icon === 'Code' && <Code size={20} />}
            {skill.icon === 'Cpu' && <Cpu size={20} />}
            {skill.icon === 'Layers' && <Layers size={20} />}
          </div>
          <h3 className="font-bold text-lg mb-3">{skill.name}</h3>
          <div className="flex flex-wrap gap-2">
            {skill.items.map((item) => (
              <span
                key={item}
                className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-md border border-gray-100 font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Skills;
