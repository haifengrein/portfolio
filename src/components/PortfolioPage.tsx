'use client';

import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Projects from './Projects';
import { Content, DATA, Language, Mode } from '@/data/siteData';

export type PortfolioPageProps = {
  initialLang?: Language;
};

const PortfolioPage = ({ initialLang = 'zh' }: PortfolioPageProps) => {
  const [mode, setMode] = useState<Mode>('gui');
  const [lang, setLang] = useState<Language>(initialLang);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const content: Content = DATA[lang];
  const common = DATA.common;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const readLangFromLocation = (): Language => {
    if (typeof window === 'undefined') return initialLang;
    const params = new URLSearchParams(window.location.search);
    return params.get('lang') === 'en' ? 'en' : 'zh';
  };

  const writeLangToLocation = (nextLang: Language) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('lang', nextLang);
    window.history.replaceState({}, '', url.toString());
  };

  useEffect(() => {
    const syncFromUrl = () => {
      const nextLang = readLangFromLocation();
      setLang((prev) => (prev === nextLang ? prev : nextLang));
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleLang = () => {
    const nextLang: Language = lang === 'zh' ? 'en' : 'zh';
    setLang(nextLang);
    writeLangToLocation(nextLang);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const renderGuiView = () => (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-black selection:text-white transition-colors duration-500">
      <Navbar
        mode={mode}
        lang={lang}
        contentName={content.name}
        nav={content.nav}
        onLangChange={toggleLang}
        onModeChange={setMode}
        onNavigate={scrollToSection}
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      <main className="max-w-4xl mx-auto px-6">
        <Hero content={content} common={common} />
        <Projects title={content.titles.projects} projects={content.projects} lang={lang} />
      </main>

      <footer className="py-10 text-center text-gray-400 text-sm bg-white border-t border-gray-100">
        <p>&copy; {new Date().getFullYear()} {content.name}. Designed with Simplicity.</p>
      </footer>
    </div>
  );

  const renderTerminalView = () => (
    <div className="min-h-screen bg-[#0c0c0c] text-green-500 font-mono p-4 md:p-8 pt-16 overflow-x-hidden selection:bg-green-900 selection:text-white">
      <Navbar
        mode={mode}
        lang={lang}
        contentName={content.name}
        nav={content.nav}
        onLangChange={toggleLang}
        onModeChange={setMode}
        onNavigate={scrollToSection}
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      <div className="max-w-4xl mx-auto mt-8">
        <div className="mb-8 border border-green-900 bg-green-900/10 p-4 text-xs md:text-sm">
          <p>Last login: {currentTime.toLocaleString()} on ttys001</p>
          <p>Kernel: Linux 5.15.0-generic (x86_64)</p>
          <p className="mt-2">Type &apos;help&apos; for available commands or use the navigation bar above.</p>
        </div>

        <div id="hero" className="mb-8">
          <div className="flex items-center text-lg mb-2">
            <span className="text-blue-500 mr-2">➜</span>
            <span className="text-purple-500 mr-2">~</span>
            <span className="typing-effect">whoami</span>
          </div>
          <div className="pl-4 border-l-2 border-green-900/50">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white tracking-tighter">{content.name}</h1>
            <p className="text-lg opacity-90 text-green-400 mb-2"> &gt; {content.role}</p>
            <p className="opacity-60 italic max-w-2xl">
              {'// '}
              {content.bio}
            </p>
          </div>
        </div>

        <div id="skills" className="mb-8">
          <div className="flex items-center text-lg mb-4">
            <span className="text-blue-500 mr-2">➜</span>
            <span className="text-purple-500 mr-2">~</span>
            <span>cat ./skills.json</span>
          </div>
          <div className="pl-4 text-sm">
            <div className="grid gap-2 text-yellow-100/80">
              {content.skills.map((skill) => (
                <div key={skill.name} className="flex">
                  <span className="w-24 opacity-50">{skill.name}:</span>
                  <span>[{skill.items.join(', ')}]</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="projects" className="mb-8">
          <div className="flex items-center text-lg mb-4">
            <span className="text-blue-500 mr-2">➜</span>
            <span className="text-purple-500 mr-2">~</span>
            <span>./deploy_projects.sh --list</span>
          </div>
          <div className="pl-4 grid gap-4">
            {content.projects.map((proj) => (
              <a
                key={proj.title}
                href={proj.deepwikiUrl ?? proj.githubUrl ?? `/projects/${proj.slug}?lang=${lang}`}
                className="border border-green-800/50 p-4 bg-green-900/5 hover:bg-green-900/10 transition-colors"
              >
                <div className="flex justify-between">
                  <span className="font-bold text-white">{proj.title}</span>
                  <span className="text-xs bg-green-900 text-green-100 px-2 rounded">RUNNING</span>
                </div>
                <div className="text-xs opacity-60 mt-2">{proj.desc}</div>
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center text-lg mt-8 mb-16 opacity-50">
          <span className="text-blue-500 mr-2">➜</span>
          <span className="text-purple-500 mr-2">~</span>
          <span className="w-2.5 h-5 bg-green-500 animate-pulse" />
        </div>
      </div>
    </div>
  );

  return mode === 'gui' ? renderGuiView() : renderTerminalView();
};

export default PortfolioPage;
