import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Monitor, 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code, 
  Cpu, 
  Layers, 
  Globe,
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Menu,
  X,
  Hash
} from 'lucide-react';

// --- 数据层 ---
const BLOG_POSTS = [
  {
    id: "why-i-love-coding",
    date: "2023-10-24",
    readTime: "5 min",
    title: {
      zh: "为什么我依然热爱编程？",
      en: "Why I Still Love Coding"
    },
    excerpt: {
      zh: "在这个AI崛起的时代，探讨代码作为一种创造性表达的意义...",
      en: "Exploring the meaning of code as creative expression in the age of AI..."
    },
    content: {
      zh: `
        <p>很多朋友问我，AI 都能写代码了，程序员还有价值吗？</p>
        <p>我的回答是：<strong>非常有价值。</strong></p>
        <h3>1. 代码是逻辑的诗歌</h3>
        <p>编程不仅仅是完成任务，它是一种将混乱思维结构化的过程。每一个函数，每一个类，都是思维的结晶。</p>
        <h3>2. 创造力的延伸</h3>
        <p>AI 是工具，而人是架构师。工具越强，架构师能实现的蓝图就越宏大。</p>
      `,
      en: `
        <p>Many friends ask me, with AI writing code, are programmers still valuable?</p>
        <p>My answer is: <strong>Absolutely.</strong></p>
        <h3>1. Code is Poetry of Logic</h3>
        <p>Programming is not just about tasks; it's about structuring chaotic thoughts.</p>
        <h3>2. Extension of Creativity</h3>
        <p>AI is the tool, humans are the architects.</p>
      `
    }
  },
  {
    id: "react-vs-vue",
    date: "2023-11-05",
    readTime: "8 min",
    title: {
      zh: "React vs Vue: 2024年怎么选？",
      en: "React vs Vue: How to choose in 2024?"
    },
    excerpt: {
      zh: "抛开性能参数，从开发体验和团队架构角度的深度对比...",
      en: "A deep dive into DX and team structure, ignoring raw performance metrics..."
    },
    content: {
      zh: "<p>这是一个永恒的话题。React 灵活，Vue 优雅。选择哪个取决于你的团队基因...</p>",
      en: "<p>An eternal topic. React is flexible, Vue is elegant. The choice depends on your team DNA...</p>"
    }
  }
];

const DATA = {
  common: {
    email: "alex.code@example.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  zh: {
    name: "陈代码",
    role: "全栈开发工程师",
    location: "上海, 中国",
    bio: "热爱开源，追求极致的用户体验。我相信代码不仅是逻辑的堆砌，更是艺术的表达。",
    available: "可接受 兼职 / 全职",
    nav: {
      home: "首页",
      skills: "技术栈",
      blog: "博客",
      projects: "项目",
      contact: "联系"
    },
    titles: {
      skills: "技术能力",
      projects: "精选项目",
      blog: "近期文章",
      contact: "保持联系"
    },
    buttons: {
      viewProject: "查看项目",
      readArticle: "阅读文章",
      backHome: "返回首页",
      toTerminal: "终端模式",
      toGui: "图形模式"
    },
    skills: [
      { name: "前端开发", icon: "Code", items: ["React", "TypeScript", "Tailwind CSS", "Next.js"] },
      { name: "后端架构", icon: "Cpu", items: ["Node.js", "Go", "PostgreSQL", "Redis"] },
      { name: "DevOps", icon: "Layers", items: ["Docker", "AWS", "CI/CD", "Nginx"] },
    ],
    projects: [
      {
        title: "Nebula Dashboard",
        desc: "基于 React 和 D3.js 的高性能数据可视化分析平台。",
        tags: ["React", "D3.js"],
        link: "#"
      },
      {
        title: "Flow State",
        desc: "一款极简主义的程序员专注力工具，集成番茄钟与白噪音。",
        tags: ["Electron", "Rust"],
        link: "#"
      }
    ]
  },
  en: {
    name: "Alex Chen",
    role: "Full Stack Developer",
    location: "Shanghai, China",
    bio: "Passionate about open source and UX. I believe code is not just logic, but art.",
    available: "Available for hire",
    nav: {
      home: "Home",
      skills: "Skills",
      blog: "Blog",
      projects: "Projects",
      contact: "Contact"
    },
    titles: {
      skills: "Tech Stack",
      projects: "Selected Projects",
      blog: "Recent Posts",
      contact: "Get in Touch"
    },
    buttons: {
      viewProject: "View Project",
      readArticle: "Read Article",
      backHome: "Back Home",
      toTerminal: "Terminal Mode",
      toGui: "GUI Mode"
    },
    skills: [
      { name: "Frontend", icon: "Code", items: ["React", "TypeScript", "Tailwind CSS", "Next.js"] },
      { name: "Backend", icon: "Cpu", items: ["Node.js", "Go", "PostgreSQL", "Redis"] },
      { name: "DevOps", icon: "Layers", items: ["Docker", "AWS", "CI/CD", "Nginx"] },
    ],
    projects: [
      {
        title: "Nebula Dashboard",
        desc: "High-performance data visualization platform built with React & D3.js.",
        tags: ["React", "D3.js"],
        link: "#"
      },
      {
        title: "Flow State",
        desc: "Minimalist focus tool for developers with Pomodoro & White Noise.",
        tags: ["Electron", "Rust"],
        link: "#"
      }
    ]
  }
};

export default function App() {
  const [mode, setMode] = useState('gui'); // 'gui' or 'terminal'
  const [lang, setLang] = useState('zh'); 
  const [view, setView] = useState('home'); // 'home' or 'blog-post'
  const [activePost, setActivePost] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const content = DATA[lang];
  const common = DATA.common;

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (view !== 'home') {
      setView('home');
      setActivePost(null);
      // Give React a moment to render the home view before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openPost = (post) => {
    setActivePost(post);
    setView('blog-post');
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setView('home');
    setActivePost(null);
  };

  if (!mounted) return null;

  // --- Components ---

  const SocialLink = ({ href, icon, label }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer" 
      className={`flex items-center space-x-2 transition-colors ${
        mode === 'gui' 
          ? 'text-gray-500 hover:text-black bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full' 
          : 'text-green-500 hover:text-green-100 hover:underline'
      }`}
    >
      {icon} <span className="font-medium text-sm">{label}</span>
    </a>
  );

  // --- 导航栏 (Navbar) ---
  const Navbar = () => {
    if (mode === 'gui') {
      return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-5'
        }`}>
          <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
            {/* Logo / Name */}
            <div 
              className="font-bold text-lg tracking-tight cursor-pointer"
              onClick={() => scrollToSection('hero')}
            >
              {content.name}<span className="text-green-500">.</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
              {['skills', 'blog', 'projects'].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="hover:text-black transition-colors"
                >
                  {content.nav[item]}
                </button>
              ))}
              <div className="h-4 w-px bg-gray-300 mx-2"></div>
              <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="hover:text-black">
                {lang === 'zh' ? 'EN' : '中'}
              </button>
              <button 
                onClick={() => setMode('terminal')} 
                className="flex items-center bg-gray-900 text-white px-3 py-1.5 rounded-full hover:bg-gray-700 transition-all text-xs"
              >
                <Terminal size={12} className="mr-1.5" /> CLI
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center space-x-4">
              <button onClick={() => setMode('terminal')} className="text-gray-900">
                <Terminal size={20} />
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-900">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Nav Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-6 flex flex-col space-y-4 animate-in slide-in-from-top-2">
              {['home', 'skills', 'blog', 'projects'].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item === 'home' ? 'hero' : item)}
                  className="text-left font-medium text-lg py-2 border-b border-gray-50 text-gray-700"
                >
                  {content.nav[item]}
                </button>
              ))}
              <div className="flex items-center justify-between pt-4">
                <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="font-medium text-gray-600">
                  {lang === 'zh' ? 'Switch to English' : '切换到中文'}
                </button>
              </div>
            </div>
          )}
        </nav>
      );
    } 
    
    // Terminal Mode Navbar (Status Bar Style)
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-green-800 text-xs md:text-sm font-mono p-2">
         <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex space-x-4">
              <span className="font-bold text-green-400">root@{content.name}:~#</span>
              <div className="hidden md:flex space-x-4 opacity-70">
                {['home', 'skills', 'blog', 'projects'].map((item) => (
                  <button key={item} onClick={() => scrollToSection(item === 'home' ? 'hero' : item)} className="hover:text-white hover:underline">
                    [{content.nav[item]}]
                  </button>
                ))}
              </div>
            </div>
            <div className="flex space-x-4">
               <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="hover:text-white">
                 LANG={lang.toUpperCase()}
               </button>
               <button onClick={() => setMode('gui')} className="flex items-center hover:text-white text-green-500">
                 <Monitor size={14} className="mr-1" /> EXIT_CLI
               </button>
            </div>
         </div>
      </div>
    );
  };

  // --- GUI 模式渲染 ---
  if (mode === 'gui') {
    return (
      <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-black selection:text-white transition-colors duration-500">
        <Navbar />
        
        {view === 'home' ? (
          <main className="max-w-4xl mx-auto px-6">
            
            {/* Hero Section */}
            <section id="hero" className="pt-40 pb-20 md:pt-48 md:pb-32">
              <div className="flex items-center space-x-2 text-sm font-bold tracking-wider text-green-600 uppercase mb-6 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>{content.available}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-gray-900 leading-[1.1]">
                {content.name}
              </h1>
              <p className="text-xl md:text-2xl text-gray-500 max-w-2xl leading-relaxed font-light">
                {content.role}。{content.bio}
              </p>
              
              <div className="flex flex-wrap gap-4 mt-10">
                <SocialLink href={common.github} icon={<Github size={18} />} label="GitHub" />
                <SocialLink href={common.linkedin} icon={<Linkedin size={18} />} label="LinkedIn" />
                <SocialLink href={`mailto:${common.email}`} icon={<Mail size={18} />} label="Email" />
              </div>
            </section>

            {/* Skills */}
            <section id="skills" className="py-16 border-t border-gray-100">
              <div className="flex items-center mb-8">
                <h2 className="text-2xl font-bold">{content.titles.skills}</h2>
                <div className="h-px bg-gray-200 flex-grow ml-4"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.skills.map((skill) => (
                  <div key={skill.name} className="bg-white p-6 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100/50 hover:border-gray-200 transition-all">
                    <div className="text-gray-800 mb-4 bg-gray-50 w-10 h-10 flex items-center justify-center rounded-lg">
                        {skill.icon === 'Code' && <Code size={20} />}
                        {skill.icon === 'Cpu' && <Cpu size={20} />}
                        {skill.icon === 'Layers' && <Layers size={20} />}
                    </div>
                    <h3 className="font-bold text-lg mb-3">{skill.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skill.items.map((item) => (
                        <span key={item} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-md border border-gray-100 font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Blog Section */}
            <section id="blog" className="py-16 border-t border-gray-100">
              <div className="flex items-center mb-8">
                <h2 className="text-2xl font-bold">{content.titles.blog}</h2>
                <div className="h-px bg-gray-200 flex-grow ml-4"></div>
              </div>
              <div className="grid gap-6">
                {BLOG_POSTS.map((post) => (
                  <div 
                    key={post.id} 
                    onClick={() => openPost(post)}
                    className="cursor-pointer bg-white p-8 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100/50 hover:shadow-md hover:border-gray-300 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    <div className="flex items-center text-xs font-semibold tracking-wider text-gray-400 uppercase mb-3">
                      <span className="flex items-center"><Calendar size={12} className="mr-1.5"/> {post.date}</span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center"><Clock size={12} className="mr-1.5"/> {post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-black transition-colors">{post.title[lang]}</h3>
                    <p className="text-gray-500 leading-relaxed">{post.excerpt[lang]}</p>
                    <div className="mt-5 text-sm font-semibold text-black flex items-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      {content.buttons.readArticle} <ArrowLeft size={16} className="ml-2 rotate-180" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section id="projects" className="py-16 border-t border-gray-100 mb-12">
               <div className="flex items-center mb-8">
                <h2 className="text-2xl font-bold">{content.titles.projects}</h2>
                <div className="h-px bg-gray-200 flex-grow ml-4"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {content.projects.map((project, index) => (
                  <div key={index} className="bg-white rounded-xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100/50 hover:shadow-lg transition-all flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-gray-50 p-2 rounded-lg"><Globe size={20}/></div>
                        <ExternalLink size={18} className="text-gray-300"/>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6">{project.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {project.tags.map(tag => (
                         <span key={tag} className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">#{tag}</span>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        ) : (
          /* Article View */
          <article className="max-w-3xl mx-auto pt-32 pb-24 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={goHome} className="mb-8 flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <ArrowLeft size={16} className="mr-2" /> {content.buttons.backHome}
            </button>
            {activePost && (
              <>
                <div className="mb-10 text-center">
                   <div className="flex items-center justify-center text-sm text-gray-400 mb-6 space-x-4">
                      <span className="flex items-center"><Calendar size={14} className="mr-1.5"/> {activePost.date}</span>
                      <span className="flex items-center"><Clock size={14} className="mr-1.5"/> {activePost.readTime}</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6 text-gray-900 tracking-tight">{activePost.title[lang]}</h1>
                </div>
                <div 
                  className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-h3:text-xl prose-a:text-blue-600 hover:prose-a:text-blue-500"
                  dangerouslySetInnerHTML={{ __html: activePost.content[lang] }}
                />
              </>
            )}
          </article>
        )}
        
        <footer className="py-12 text-center text-gray-400 text-sm bg-white border-t border-gray-100">
          <p>&copy; {new Date().getFullYear()} {content.name}. Designed with Simplicity.</p>
        </footer>
      </div>
    );
  }

  // --- Terminal 模式 ---
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-green-500 font-mono p-4 md:p-8 pt-16 overflow-x-hidden selection:bg-green-900 selection:text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto mt-8">
        {/* Intro Banner */}
        <div className="mb-8 border border-green-900 bg-green-900/10 p-4 text-xs md:text-sm">
           <p>Last login: {currentTime.toLocaleString()} on ttys001</p>
           <p>Kernel: Linux 5.15.0-generic (x86_64)</p>
           <p className="mt-2">Type 'help' for available commands or use the navigation bar above.</p>
        </div>

        {view === 'home' ? (
          <>
            <div id="hero" className="mb-12">
              <div className="flex items-center text-lg mb-2">
                <span className="text-blue-500 mr-2">➜</span><span className="text-purple-500 mr-2">~</span>
                <span className="typing-effect">whoami</span>
              </div>
              <div className="pl-4 border-l-2 border-green-900/50">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white tracking-tighter">{content.name}</h1>
                <p className="text-lg opacity-90 text-green-400 mb-2"> &gt; {content.role}</p>
                <p className="opacity-60 italic max-w-2xl"> // {content.bio}</p>
              </div>
            </div>

            <div id="skills" className="mb-12">
              <div className="flex items-center text-lg mb-4">
                <span className="text-blue-500 mr-2">➜</span><span className="text-purple-500 mr-2">~</span>
                <span>cat ./skills.json</span>
              </div>
              <div className="pl-4 text-sm">
                <div className="grid gap-2 text-yellow-100/80">
                  {content.skills.map((skill, i) => (
                     <div key={i} className="flex">
                       <span className="w-24 opacity-50">{skill.name}:</span>
                       <span>[{skill.items.join(", ")}]</span>
                     </div>
                  ))}
                </div>
              </div>
            </div>

            <div id="blog" className="mb-12">
              <div className="flex items-center text-lg mb-4">
                <span className="text-blue-500 mr-2">➜</span><span className="text-purple-500 mr-2">~</span>
                <span>ls -l ./posts</span>
              </div>
              <div className="pl-4 flex flex-col space-y-2">
                <div className="text-xs opacity-40 mb-2 border-b border-green-900 w-fit pb-1">Permissions &nbsp; User &nbsp; Size &nbsp; Date &nbsp; &nbsp; &nbsp; Name</div>
                {BLOG_POSTS.map((post) => (
                  <div 
                    key={post.id} 
                    className="flex flex-col md:flex-row md:items-center hover:bg-green-500/10 p-1 -ml-1 cursor-pointer group transition-colors"
                    onClick={() => openPost(post)}
                  >
                     <span className="font-mono text-xs opacity-50 mr-4">-rw-r--r--</span>
                     <span className="font-mono text-xs opacity-50 mr-4">alex</span>
                     <span className="font-mono text-xs opacity-50 mr-4 w-12">{post.readTime}</span>
                     <span className="font-mono text-xs opacity-50 mr-4 w-24">{post.date}</span>
                     <span className="font-bold text-green-400 group-hover:text-white group-hover:underline decoration-green-500">{post.id}.md</span>
                     <span className="hidden md:inline-block text-xs opacity-40 ml-4 text-gray-400"># {post.title[lang]}</span>
                  </div>
                ))}
              </div>
            </div>

             <div id="projects" className="mb-12">
              <div className="flex items-center text-lg mb-4">
                <span className="text-blue-500 mr-2">➜</span><span className="text-purple-500 mr-2">~</span>
                <span>./deploy_projects.sh --list</span>
              </div>
               <div className="pl-4 grid gap-4">
                 {content.projects.map((proj, i) => (
                   <div key={i} className="border border-green-800/50 p-4 bg-green-900/5">
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
          /* Terminal Article View */
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center text-lg mb-6">
              <span className="text-blue-500 mr-2">➜</span><span className="text-purple-500 mr-2">~</span>
              <span>vim ./posts/{activePost?.id}.md</span>
            </div>
            {activePost && (
            <div className="border border-green-700 p-6 bg-black shadow-[0_0_20px_rgba(0,255,0,0.05)]">
              <div className="border-b border-green-800 pb-4 mb-6 flex justify-between items-end">
                <h1 className="text-xl md:text-2xl font-bold text-white">{activePost.title[lang]}</h1>
                <div className="text-xs text-green-600">
                   {activePost.date} | {activePost.readTime}
                </div>
              </div>
              <div 
                className="prose prose-invert prose-green max-w-none prose-p:opacity-80 prose-headings:text-green-400"
                dangerouslySetInnerHTML={{ __html: activePost.content[lang] }}
              />
              <div className="mt-12 pt-4 border-t border-green-900 border-dashed text-center">
                 <button onClick={goHome} className="hover:bg-green-500 hover:text-black px-4 py-2 border border-green-500 transition-all font-bold">
                   :q! (Exit)
                 </button>
              </div>
            </div>
            )}
          </div>
        )}

        {view === 'home' && (
          <div className="flex items-center text-lg mt-12 mb-24 opacity-50">
            <span className="text-blue-500 mr-2">➜</span><span className="text-purple-500 mr-2">~</span>
            <span className="w-2.5 h-5 bg-green-500 animate-pulse"></span>
          </div>
        )}
      </div>
    </div>
  );
}