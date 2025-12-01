'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Skills from './Skills';
import BlogList from './BlogList';
import BlogPostContent from './BlogPostContent';
import Projects from './Projects';
import { Content, DATA, Language } from '@/data/siteData';
import { Post } from '@/lib/markdown';
import { Mode, View } from '@/types/ui';

export type PortfolioPageProps = {
  posts: Post[];
};

const PortfolioPage = ({ posts }: PortfolioPageProps) => {
  const [mode, setMode] = useState<Mode>('gui');
  const [lang, setLang] = useState<Language>('zh');
  const [view, setView] = useState<View>('home');
  const [activePostSlug, setActivePostSlug] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const content: Content = DATA[lang];
  const common = DATA.common;

  const postsByLang = useMemo(() => posts.filter((post) => post.lang === lang), [posts, lang]);
  const activePost = useMemo(
    () => (activePostSlug ? posts.find((post) => post.slug === activePostSlug) || null : null),
    [activePostSlug, posts]
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (activePost && activePost.lang !== lang) {
      setView('home');
      setActivePostSlug(null);
    }
  }, [activePost, lang]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (view !== 'home') {
      setView('home');
      setActivePostSlug(null);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openPost = (post: Post) => {
    setActivePostSlug(post.slug);
    setView('blog-post');
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setView('home');
    setActivePostSlug(null);
    setMobileMenuOpen(false);
  };

  const renderGuiView = () => (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-black selection:text-white transition-colors duration-500">
      <Navbar
        mode={mode}
        lang={lang}
        contentName={content.name}
        nav={content.nav}
        onLangChange={() => setLang(lang === 'zh' ? 'en' : 'zh')}
        onModeChange={setMode}
        onNavigate={scrollToSection}
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      {view === 'home' ? (
        <main className="max-w-4xl mx-auto px-6">
          <Hero content={content} common={common} />
          <Skills title={content.titles.skills} skills={content.skills} />
          <BlogList title={content.titles.blog} posts={postsByLang} ctaLabel={content.buttons.readArticle} onSelect={openPost} />
          <Projects title={content.titles.projects} projects={content.projects} />
        </main>
      ) : (
        activePost && (
          <div className="max-w-3xl mx-auto pt-32 pb-24 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BlogPostContent post={activePost} backLabel={content.buttons.backHome} onBack={goHome} />
          </div>
        )
      )}

      <footer className="py-12 text-center text-gray-400 text-sm bg-white border-t border-gray-100">
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
        onLangChange={() => setLang(lang === 'zh' ? 'en' : 'zh')}
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

        {view === 'home' ? (
          <>
            <div id="hero" className="mb-12">
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

            <div id="skills" className="mb-12">
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

            <div id="blog" className="mb-12">
              <div className="flex items-center text-lg mb-4">
                <span className="text-blue-500 mr-2">➜</span>
                <span className="text-purple-500 mr-2">~</span>
                <span>ls -l ./posts</span>
              </div>
              <div className="pl-4 flex flex-col space-y-2">
                <div className="text-xs opacity-40 mb-2 border-b border-green-900 w-fit pb-1">
                  Permissions &nbsp; User &nbsp; Size &nbsp; Date &nbsp; &nbsp; &nbsp; Name
                </div>
                {postsByLang.map((post) => (
                  <div
                    key={post.slug}
                    className="flex flex-col md:flex-row md:items-center hover:bg-green-500/10 p-1 -ml-1 cursor-pointer group transition-colors"
                    onClick={() => openPost(post)}
                  >
                    <span className="font-mono text-xs opacity-50 mr-4">-rw-r--r--</span>
                    <span className="font-mono text-xs opacity-50 mr-4">alex</span>
                    <span className="font-mono text-xs opacity-50 mr-4 w-12">{post.readTime}</span>
                    <span className="font-mono text-xs opacity-50 mr-4 w-24">{post.date}</span>
                    <span className="font-bold text-green-400 group-hover:text-white group-hover:underline decoration-green-500">
                      {post.slug}.md
                    </span>
                    <span className="hidden md:inline-block text-xs opacity-40 ml-4 text-gray-400"># {post.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div id="projects" className="mb-12">
              <div className="flex items-center text-lg mb-4">
                <span className="text-blue-500 mr-2">➜</span>
                <span className="text-purple-500 mr-2">~</span>
                <span>./deploy_projects.sh --list</span>
              </div>
              <div className="pl-4 grid gap-4">
                {content.projects.map((proj) => (
                  <div key={proj.title} className="border border-green-800/50 p-4 bg-green-900/5">
                    <div className="flex justify-between">
                      <span className="font-bold text-white">{proj.title}</span>
                      <span className="text-xs bg-green-900 text-green-100 px-2 rounded">RUNNING</span>
                    </div>
                    <div className="text-xs opacity-60 mt-2">{proj.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          activePost && (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center text-lg mb-6">
                <span className="text-blue-500 mr-2">➜</span>
                <span className="text-purple-500 mr-2">~</span>
                <span>
                  vim ./posts/{activePost.slug}.md
                </span>
              </div>
              <BlogPostContent post={activePost} variant="terminal" backLabel=":q! (Exit)" onBack={goHome} />
            </div>
          )
        )}

        {view === 'home' && (
          <div className="flex items-center text-lg mt-12 mb-24 opacity-50">
            <span className="text-blue-500 mr-2">➜</span>
            <span className="text-purple-500 mr-2">~</span>
            <span className="w-2.5 h-5 bg-green-500 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );

  return mode === 'gui' ? renderGuiView() : renderTerminalView();
};

export default PortfolioPage;
