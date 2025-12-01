import { Monitor, Menu, Terminal, X } from 'lucide-react';
import { Language, Content } from '@/data/siteData';
import { Mode } from '@/types/ui';

export type NavbarProps = {
  mode: Mode;
  lang: Language;
  contentName: string;
  nav: Content['nav'];
  onLangChange: () => void;
  onModeChange: (mode: Mode) => void;
  onNavigate: (section: string) => void;
  scrolled: boolean;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
};

const Navbar = ({
  mode,
  lang,
  contentName,
  nav,
  onLangChange,
  onModeChange,
  onNavigate,
  scrolled,
  mobileMenuOpen,
  onToggleMobileMenu
}: NavbarProps) => {
  if (mode === 'gui') {
    return (
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div className="font-bold text-lg tracking-tight cursor-pointer" onClick={() => onNavigate('hero')}>
            {contentName}
            <span className="text-green-500">.</span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            {['skills', 'blog', 'projects'].map((item) => (
              <button key={item} onClick={() => onNavigate(item)} className="hover:text-black transition-colors">
                {nav[item as keyof typeof nav]}
              </button>
            ))}
            <div className="h-4 w-px bg-gray-300 mx-2" />
            <button onClick={onLangChange} className="hover:text-black">
              {lang === 'zh' ? 'EN' : '中'}
            </button>
            <button
              onClick={() => onModeChange('terminal')}
              className="flex items-center bg-gray-900 text-white px-3 py-1.5 rounded-full hover:bg-gray-700 transition-all text-xs"
            >
              <Terminal size={12} className="mr-1.5" /> CLI
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => onModeChange('terminal')} className="text-gray-900">
              <Terminal size={20} />
            </button>
            <button onClick={onToggleMobileMenu} className="text-gray-900">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-6 flex flex-col space-y-4 animate-in slide-in-from-top-2">
            {['home', 'skills', 'blog', 'projects'].map((item) => (
              <button
                key={item}
                onClick={() => onNavigate(item === 'home' ? 'hero' : item)}
                className="text-left font-medium text-lg py-2 border-b border-gray-50 text-gray-700"
              >
                {nav[item as keyof typeof nav]}
              </button>
            ))}
            <div className="flex items-center justify-between pt-4">
              <button onClick={onLangChange} className="font-medium text-gray-600">
                {lang === 'zh' ? 'Switch to English' : '切换到中文'}
              </button>
            </div>
          </div>
        )}
      </nav>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-green-800 text-xs md:text-sm font-mono p-2">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <span className="font-bold text-green-400">root@{contentName}:~#</span>
          <div className="hidden md:flex space-x-4 opacity-70">
            {['home', 'skills', 'blog', 'projects'].map((item) => (
              <button
                key={item}
                onClick={() => onNavigate(item === 'home' ? 'hero' : item)}
                className="hover:text-white hover:underline"
              >
                [{nav[item as keyof typeof nav]}]
              </button>
            ))}
          </div>
        </div>
        <div className="flex space-x-4">
          <button onClick={onLangChange} className="hover:text-white">
            LANG={lang.toUpperCase()}
          </button>
          <button onClick={() => onModeChange('gui')} className="flex items-center hover:text-white text-green-500">
            <Monitor size={14} className="mr-1" /> EXIT_CLI
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
