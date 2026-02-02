export type Language = 'zh' | 'en';
export type Mode = 'gui' | 'terminal';

export type Skill = {
  name: string;
  icon: 'Code' | 'Cpu' | 'Layers';
  items: string[];
};

export type Project = {
  slug: string;
  title: string;
  desc: string;
  tags: string[];
  link: string;
  githubUrl?: string;
  deepwikiUrl?: string;
  colabUrl?: string;
  deployUrl?: string;
  reserveExternalLinks?: boolean;
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
    projects: string;
    contact: string;
  };
  titles: {
    skills: string;
    projects: string;
    contact: string;
  };
  buttons: Buttons;
  skills: Skill[];
  projects: Project[];
};

export const DATA: { common: { email: string; github: string; linkedin: string }; zh: Content; en: Content } = {
  common: {
    email: 'hf.hou@outlook.com',
    github: 'https://github.com/haifengrein',
    linkedin: 'https://www.linkedin.com/in/haifenghou'
  },
  zh: {
    name: '侯海锋',
    role: '软件开发工程师',
    location: '慕尼黑, 德国',
    bio: '做可维护的系统，也做更好用的产品。',
    available: '求职中',
    nav: {
      home: '首页',
      skills: '技术栈',
      projects: '项目',
      contact: '联系'
    },
    titles: {
      skills: '技术能力',
      projects: '精选项目',
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
      { name: '后端架构', icon: 'Cpu', items: ['Java (Spring)', 'Python (FastAPI)', 'C++ (CUDA)', 'PostgreSQL'] },
      { name: 'DevOps', icon: 'Layers', items: ['Docker', 'Nginx', 'gRPC', 'PyTorch'] }
    ],
    projects: [
      {
        slug: 'dfs-observability-stack',
        title: '分布式文件系统',
        desc: '分布式文件系统 (DFS): 一套客户端-服务端文件同步系统，支持实时复制；基于 gRPC 通信、inotify 监控变更，并用分布式锁保障一致性。',
        tags: ['C++', 'gRPC', 'Docker', 'FastAPI'],
        link: '/projects/dfs-observability-stack',
        githubUrl: 'https://github.com/haifengrein/Distributed-File-System',
        deepwikiUrl: 'https://deepwiki.com/haifengrein/Distributed-File-System/1-overview',
        deployUrl: 'https://dfs.haifenghou.com'
      },
      {
        slug: 'turbosort-cuda',
        title: 'TurboSort CUDA',
        desc: '高性能双调排序库：采用 CUDA C++ 实现的高度优化并行排序算法，封装为 PyTorch 自定义算子。专为 NVIDIA H100/L40S 架构优化，相比单核 CPU 基准测试实现高达 260 倍的性能提升。',
        tags: ['CUDA', 'C++', 'PyTorch', 'Python', 'NVIDIA GPU'],
        link: '/projects/turbosort-cuda',
        githubUrl: 'https://github.com/haifengrein/TurboSort-CUDA',
        colabUrl: 'https://colab.research.google.com/drive/1pVf_3wVXn47hfvbLXMewig3FG24BWg7t?usp=sharing'
      },
      {
        slug: 'burdells-dogs-modernization',
        title: "Burdell's Dogs Platform",
        desc: "Burdell's Dogs Platform：一套犬只救助与领养管理系统，覆盖系统目标、用户角色、核心功能与技术架构。采用云原生混合架构（Flask + FastAPI），并引入 Docker、React 与 OAuth2。",
        tags: ['Python', 'FastAPI', 'React', 'Docker', 'MySQL', 'OAuth2'],
        link: '/projects/burdells-dogs-modernization',
        githubUrl: 'https://github.com/haifengrein/burdells-dogs-platform',
        deepwikiUrl: 'https://deepwiki.com/haifengrein/burdells-dogs-platform',
        deployUrl: 'https://db.haifenghou.com'
      },
      {
        slug: 'eurobite',
        title: 'Eurobite',
        desc: 'Eurobite 是一个全面的全栈餐饮管理平台。它满足了现代餐饮企业的核心运营需求，优化了从用户订购到厨房准备和财务报告的整个流程。',
        tags: ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Docker'],
        link: '/projects/eurobite',
        githubUrl: 'https://github.com/haifengrein/Eurobite',
        deepwikiUrl: 'https://deepwiki.com/haifengrein/Eurobite',
        deployUrl: 'https://eurobite.haifenghou.com'
      }
    ]
  },
  en: {
    name: 'Haifeng Hou',
    role: 'Software Developer',
    location: 'Munich, Germany',
    bio: 'Build maintainable systems and ship products that are genuinely usable.',
    available: 'Available for hire',
    nav: {
      home: 'Home',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact'
    },
    titles: {
      skills: 'Tech Stack',
      projects: 'Selected Projects',
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
      { name: 'Backend', icon: 'Cpu', items: ['Java (Spring)', 'Python (FastAPI)', 'C++ (CUDA)', 'PostgreSQL'] },
      { name: 'DevOps', icon: 'Layers', items: ['Docker', 'Nginx', 'gRPC', 'PyTorch'] }
    ],
    projects: [
      {
        slug: 'dfs-observability-stack',
        title: 'Distributed File System',
        desc: 'Distributed File System (DFS): a client–server file sync system with real-time replication, using gRPC, inotify monitoring, and distributed locking for consistency.',
        tags: ['C++', 'gRPC', 'Docker', 'FastAPI'],
        link: '/projects/dfs-observability-stack',
        githubUrl: 'https://github.com/haifengrein/Distributed-File-System',
        deepwikiUrl: 'https://deepwiki.com/haifengrein/Distributed-File-System/1-overview',
        deployUrl: 'https://dfs.haifenghou.com'
      },
      {
        slug: 'turbosort-cuda',
        title: 'TurboSort CUDA',
        desc: 'High-Performance Bitonic Sort. A highly optimized parallel sorting library implemented in CUDA C++ and exposed as a custom PyTorch operator. Targets NVIDIA H100/L40S architectures, achieving up to 260x performance uplift.',
        tags: ['CUDA', 'C++', 'PyTorch', 'Python', 'NVIDIA GPU'],
        link: '/projects/turbosort-cuda',
        githubUrl: 'https://github.com/haifengrein/TurboSort-CUDA',
        colabUrl: 'https://colab.research.google.com/drive/1pVf_3wVXn47hfvbLXMewig3FG24BWg7t?usp=sharing'
      },
      {
        slug: 'burdells-dogs-modernization',
        title: "Burdell's Dogs Platform",
        desc: "Burdell's Dogs Platform, a comprehensive dog rescue and adoption management system. It covers the system's purpose, user roles, core feature areas, and technology architecture. Built as a cloud-native hybrid architecture (Flask + FastAPI) with Docker, React, and OAuth2.",
        tags: ['Python', 'FastAPI', 'React', 'Docker', 'MySQL', 'OAuth2'],
        link: '/projects/burdells-dogs-modernization',
        githubUrl: 'https://github.com/haifengrein/burdells-dogs-platform',
        deepwikiUrl: 'https://deepwiki.com/haifengrein/burdells-dogs-platform',
        deployUrl: 'https://db.haifenghou.com'
      },
      {
        slug: 'eurobite',
        title: 'Eurobite',
        desc: 'Eurobite is a comprehensive, full-stack food delivery and restaurant management platform. It addresses the core operational needs of modern catering businesses, streamlining the process from user ordering to kitchen preparation and financial reporting.',
        tags: ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Docker'],
        link: '/projects/eurobite',
        githubUrl: 'https://github.com/haifengrein/Eurobite',
        deepwikiUrl: 'https://deepwiki.com/haifengrein/Eurobite',
        deployUrl: 'https://eurobite.haifenghou.com'
      }
    ]
  }
};