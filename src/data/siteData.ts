export type Language = 'zh' | 'en';

export type Skill = {
  name: string;
  icon: 'Code' | 'Cpu' | 'Layers';
  items: string[];
};

export type Project = {
  title: string;
  desc: string;
  tags: string[];
  link: string;
};

export type Buttons = {
  viewProject: string;
  readArticle: string;
  backHome: string;
  toTerminal: string;
  toGui: string;
};

export type Content = {
  name: string;
  role: string;
  location: string;
  bio: string;
  available: string;
  nav: {
    home: string;
    skills: string;
    blog: string;
    projects: string;
    contact: string;
  };
  titles: {
    skills: string;
    projects: string;
    blog: string;
    contact: string;
  };
  buttons: Buttons;
  skills: Skill[];
  projects: Project[];
};

export const DATA: { common: { email: string; github: string; linkedin: string }; zh: Content; en: Content } = {
  common: {
    email: 'alex.code@example.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  zh: {
    name: '陈代码',
    role: '全栈开发工程师',
    location: '上海, 中国',
    bio: '热爱开源，追求极致的用户体验。我相信代码不仅是逻辑的堆砌，更是艺术的表达。',
    available: '可接受 兼职 / 全职',
    nav: {
      home: '首页',
      skills: '技术栈',
      blog: '博客',
      projects: '项目',
      contact: '联系'
    },
    titles: {
      skills: '技术能力',
      projects: '精选项目',
      blog: '近期文章',
      contact: '保持联系'
    },
    buttons: {
      viewProject: '查看项目',
      readArticle: '阅读文章',
      backHome: '返回首页',
      toTerminal: '终端模式',
      toGui: '图形模式'
    },
    skills: [
      { name: '前端开发', icon: 'Code', items: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'] },
      { name: '后端架构', icon: 'Cpu', items: ['Node.js', 'Go', 'PostgreSQL', 'Redis'] },
      { name: 'DevOps', icon: 'Layers', items: ['Docker', 'AWS', 'CI/CD', 'Nginx'] }
    ],
    projects: [
      {
        title: 'Nebula Dashboard',
        desc: '基于 React 和 D3.js 的高性能数据可视化分析平台。',
        tags: ['React', 'D3.js'],
        link: '#'
      },
      {
        title: 'Flow State',
        desc: '一款极简主义的程序员专注力工具，集成番茄钟与白噪音。',
        tags: ['Electron', 'Rust'],
        link: '#'
      }
    ]
  },
  en: {
    name: 'Alex Chen',
    role: 'Full Stack Developer',
    location: 'Shanghai, China',
    bio: 'Passionate about open source and UX. I believe code is not just logic, but art.',
    available: 'Available for hire',
    nav: {
      home: 'Home',
      skills: 'Skills',
      blog: 'Blog',
      projects: 'Projects',
      contact: 'Contact'
    },
    titles: {
      skills: 'Tech Stack',
      projects: 'Selected Projects',
      blog: 'Recent Posts',
      contact: 'Get in Touch'
    },
    buttons: {
      viewProject: 'View Project',
      readArticle: 'Read Article',
      backHome: 'Back Home',
      toTerminal: 'Terminal Mode',
      toGui: 'GUI Mode'
    },
    skills: [
      { name: 'Frontend', icon: 'Code', items: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'] },
      { name: 'Backend', icon: 'Cpu', items: ['Node.js', 'Go', 'PostgreSQL', 'Redis'] },
      { name: 'DevOps', icon: 'Layers', items: ['Docker', 'AWS', 'CI/CD', 'Nginx'] }
    ],
    projects: [
      {
        title: 'Nebula Dashboard',
        desc: 'High-performance data visualization platform built with React & D3.js.',
        tags: ['React', 'D3.js'],
        link: '#'
      },
      {
        title: 'Flow State',
        desc: 'Minimalist focus tool for developers with Pomodoro & White Noise.',
        tags: ['Electron', 'Rust'],
        link: '#'
      }
    ]
  }
};
