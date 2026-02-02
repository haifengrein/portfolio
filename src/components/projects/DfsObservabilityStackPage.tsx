'use client';

import { useEffect, useState } from 'react';

import ProjectPageShell from './ProjectPageShell';
import ProjectExternalLinks from './ProjectExternalLinks';

type Lang = 'zh' | 'en';

export type DfsObservabilityStackPageProps = {
  initialLang?: Lang;
  backHref?: string;
  githubUrl?: string;
  deepwikiUrl?: string;
  deployUrl?: string;
};

const DfsObservabilityStackPage = ({ initialLang = 'zh', backHref, githubUrl, deepwikiUrl, deployUrl }: DfsObservabilityStackPageProps) => {
  const [lang, setLang] = useState<Lang>(initialLang);
  const isEn = lang === 'en';

  useEffect(() => {
    const readLang = () => {
      const params = new URLSearchParams(window.location.search);
      const nextLang: Lang = params.get('lang') === 'en' ? 'en' : 'zh';
      setLang((prev) => (prev === nextLang ? prev : nextLang));
    };

    readLang();
    window.addEventListener('popstate', readLang);
    return () => window.removeEventListener('popstate', readLang);
  }, []);

  const heroTitle = isEn ? 'Core Distributed Architecture' : '分布式文件系统核心架构';
  const heroSubtitle = isEn ? 'A strongly consistent storage engine built with C++14 and gRPC.' : '基于 C++14 与 gRPC 构建的强一致性分布式存储引擎。';

  return (
    <ProjectPageShell
      title={heroTitle}
      backHref={backHref ?? `/?lang=${lang}`}
      subtitle={
        <div className="space-y-4">
          <p>{heroSubtitle}</p>
          <div className="flex flex-wrap gap-2">
            {['C++14', 'Pthread Mutex', 'gRPC Async', 'POSIX Storage', 'Event Sourcing'].map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700"
              >
                {item}
              </span>
            ))}
          </div>
          <div>
            <a
              href="#demo"
              className="inline-flex items-center rounded-lg bg-gray-900 text-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-700 transition-colors"
            >
              {isEn ? 'Launch Control Panel' : '前往可视化控制台'}
            </a>
          </div>
        </div>
      }
      actions={
        <div className="flex items-center gap-2">
          <ProjectExternalLinks githubUrl={githubUrl} deepwikiUrl={deepwikiUrl} deployUrl={deployUrl} showPlaceholders={false} variant="page" />
          <button
            type="button"
            onClick={() => {
              const nextLang: Lang = isEn ? 'zh' : 'en';
              setLang(nextLang);
              const url = new URL(window.location.href);
              url.searchParams.set('lang', nextLang);
              window.history.replaceState({}, '', url.toString());
            }}
            className="inline-flex items-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 text-xs font-semibold transition-colors"
          >
            {isEn ? '中' : 'EN'}
          </button>
        </div>
      }
    >
      <section id="arch" className="py-10 border-t border-gray-100">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold">{isEn ? 'System Internals' : '核心机制解构'}</h2>
          <div className="h-px bg-gray-200 flex-grow ml-4" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#9CA3AF" />
                </marker>
              </defs>

              <rect x="200" y="50" width="200" height="220" rx="8" fill="#F9FAFB" stroke="#E5E7EB" strokeDasharray="5,5" />
              <text x="300" y="40" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="12" fontWeight="700" fill="#111827">
                DFS Server Node (C++)
              </text>

              <rect x="220" y="80" width="160" height="40" rx="6" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
              <text x="300" y="105" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="12" fontWeight="700" fill="#111827">
                gRPC Service Impl
              </text>

              <rect x="220" y="140" width="160" height="40" rx="6" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
              <text x="300" y="165" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="12" fontWeight="700" fill="#111827">
                Lock Manager
              </text>

              <rect x="220" y="200" width="160" height="40" rx="6" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
              <text x="300" y="225" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="12" fontWeight="700" fill="#111827">
                Storage Engine (POSIX)
              </text>

              <rect x="420" y="140" width="100" height="100" rx="6" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
              <text x="470" y="170" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="12" fontWeight="700" fill="#3B82F6">
                Event Bus
              </text>
              <text x="470" y="190" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="10" fill="#6B7280">
                Monitor Service
              </text>
              <text x="470" y="210" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="10" fill="#6B7280">
                Pub/Sub
              </text>

              <rect x="20" y="150" width="100" height="60" rx="6" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
              <text x="70" y="175" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="12" fontWeight="700" fill="#111827">
                Client A
              </text>
              <text x="70" y="195" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="10" fill="#6B7280">
                Write Request
              </text>

              <path d="M120 180 L220 160" stroke="#9CA3AF" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
              <path d="M380 160 L420 160" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4" fill="none" markerEnd="url(#arrow)" />
              <path d="M300 120 L300 140" stroke="#9CA3AF" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
              <path d="M300 180 L300 200" stroke="#9CA3AF" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />

              <path d="M470 240 L470 320" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4" fill="none" markerEnd="url(#arrow)" />
              <rect x="420" y="320" width="100" height="40" rx="6" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
              <text x="470" y="345" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="12" fontWeight="700" fill="#111827">
                Dashboard
              </text>
            </svg>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold">{isEn ? 'Distributed Write Locks' : '分布式写锁 (Write Locks)'}</h3>
                <span className="ml-auto text-[11px] px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-gray-600">Consistency</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {isEn
                  ? 'Clients must acquire a lease via RequestWriteLock RPC before streaming data. Lock ownership is strictly serialized to avoid conflicts.'
                  : 'Client 在写入前通过 RequestWriteLock RPC 申请租约；Server 侧序列化写入所有权，拒绝并发冲突。'}
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold">{isEn ? 'Asynchronous Event Bus' : '异步事件流 (Event Sourcing)'}</h3>
                <span className="ml-auto text-[11px] px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-gray-600">Observability</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {isEn
                  ? 'A non-blocking EventBus captures state changes and streams them to the dashboard, keeping monitoring off the critical path.'
                  : '用非阻塞 EventBus 捕获状态变化并推送到 Dashboard，将监控从主链路解耦，避免影响吞吐。'}
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold">{isEn ? 'Storage Abstraction' : '存储引擎抽象 (Storage Engine)'}</h3>
                <span className="ml-auto text-[11px] px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-gray-600">Persistence</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {isEn
                  ? 'I/O is abstracted behind a StorageEngine interface: POSIX for production and mocks for unit tests and fault injection.'
                  : 'I/O 封装为 StorageEngine 接口：生产用 POSIX 实现，测试用 Mock 以支持故障注入与验证。'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="takeaways" className="py-10 border-t border-gray-100">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold">{isEn ? 'Key Engineering Challenges' : '工程挑战与思考'}</h2>
          <div className="h-px bg-gray-200 flex-grow ml-4" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="text-xl mb-3">🆔</div>
            <h3 className="font-bold text-lg mb-2">{isEn ? 'The Identity Crisis in Docker' : 'Docker 容器内的身份危机'}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {isEn
                ? 'Client IDs collided when simulating multiple clients in a single container. The fix was to use distinct client containers with unique hostnames via docker-compose.'
                : '单容器模拟多 Client 时 Client ID 会碰撞。通过 docker-compose 拆分为独立 client 容器并赋予不同 Hostname 解决。'}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="text-xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2">{isEn ? 'Event Stream Race Conditions' : '事件流的竞态条件'}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {isEn
                ? 'Duplicate or out-of-order events caused UI flickering. Fixes included correcting a ThreadSafeQueue bug and controlling replay behavior.'
                : '高并发下可能出现重复/乱序事件导致前端闪烁。修复队列逻辑并控制历史事件重放，保证流生命周期。'}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="text-xl mb-3">🔒</div>
            <h3 className="font-bold text-lg mb-2">{isEn ? 'Write Locks: Failure Boundaries' : '写锁的失败边界与释放保证'}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {isEn
                ? 'Long-lived streaming RPCs require explicit lock release on every success/error/cancel path to avoid stale locks or partial writes.'
                : '长生命周期 streaming RPC 需要在成功/异常/取消等所有路径显式释放锁，避免遗留锁或半写入。'}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="text-xl mb-3">🧮</div>
            <h3 className="font-bold text-lg mb-2">{isEn ? 'CRC + mtime Decisions' : 'CRC + mtime：一致性判断与无效传输'}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {isEn
                ? 'CRC prunes redundant transfers; mtime helps choose sync direction. Together they reduce wasted sync and converge safely.'
                : 'CRC 用于剪枝避免重复传输，mtime 用于决策同步方向；两者结合减少无效同步并收敛一致性。'}
            </p>
          </div>
        </div>
      </section>

      <section id="demo" className="py-10 border-t border-gray-100">
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-2xl font-extrabold mb-3">{isEn ? 'Ready to verify?' : '准备好开始了吗？'}</h2>
          <p className="text-gray-600 mb-6">
            {isEn
              ? 'Start the local Docker environment and access the dashboard for conflict testing.'
              : '启动本地 Docker 环境，访问 Dashboard 进行并发冲突测试。'}
          </p>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg bg-gray-900 text-white px-5 py-3 text-sm font-semibold hover:bg-gray-700 transition-colors"
          >
            {isEn ? '🚀 Open Dashboard' : '🚀 打开控制台'}
          </a>
        </div>
      </section>
    </ProjectPageShell>
  );
};

export default DfsObservabilityStackPage;
