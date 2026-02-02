'use client';

import Image from 'next/image';
import { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import {
  Menu,
  Languages,
  LayoutDashboard,
  BarChart2,
  GitCommit,
  Cpu,
  Maximize2,
  AlertOctagon,
  Layers,
  PlayCircle,
  Play,
  Github,
  X
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
  Filler,
  ScriptableContext
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import mermaid from 'mermaid';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- Types & Data ---

type Lang = 'zh' | 'en';

const TRANSLATIONS = {
  zh: {
    nav: {
      overview: "项目概览",
      benchmark: "性能基准",
      timeline: "优化演进",
      challenges: "核心挑战"
    },
    hero: {
      desc: (
        <>
          一个针对 NVIDIA H100/L40S 架构深度优化的 Bitonic Sort 实现。
          通过利用 <span className="text-white font-medium">Shared Memory</span>、
          <span className="text-white font-medium">Warp Shuffle</span> 和 <span className="text-white font-medium">Vectorized IO</span>，
          相比单核 CPU 性能提升了 <span className="text-brand-400 font-bold">260x</span>。
        </>
      )
    },
    kpi: {
      speedup: "Speedup vs CPU",
      latency: "100M Items Latency",
      throughput: "Elements / Sec",
      vector: "Vectorized IO"
    },
    arch: {
      title: "架构图 (点击放大)",
      zoom: "点击放大"
    },
    bench: {
      title: "性能基准 (Benchmarks)",
      analysis_title: "分析：启动开销",
      analysis_text: (
        <>
          <strong className="text-brand-400">低开销优势：</strong> 在极小样本 (256 elements) 下，PyTorch (Based on RadixSort) 的耗时为 <strong>0.103ms</strong>，而本项目的 Custom Kernel 仅需 <strong>0.014ms</strong>。
          <br /><br />
          这证明了 TurboSort 在启动开销 (Startup Cost) 上具有显著优势，非常适合 Batch Size 小但调用频繁的场景。
        </>
      ),
      peak_title: "Kernel 峰值吞吐量",
      peak_desc: (
        <>
          计算: <code>100M / 54.19ms</code>。<br />
          高吞吐量得益于 <code>int4</code> 向量化 IO (kernel.cu 第 132 行)，跑满了 HBM 带宽。
        </>
      )
    },
    timeline: {
      title: "从 Baseline 到 SOTA 的优化之路"
    },
    step1: {
      title: "Baseline Implementation (Global Memory)",
      desc: (
        <>
          <strong className="text-white">作用:</strong> 这是一个标准的 Global Memory 归并实现，每个线程独立读取两个 Global 内存地址比较并写回。这是所有优化的起点。
        </>
      )
    },
    step2: {
      title: "Block-Level Sorting (Shared Memory)",
      desc: (
        <>
          <strong className="text-white">作用:</strong> 线程将数据从 Global 加载到 Shared Memory，在片上内存中完成 k=2 到 k=BLKSIZE 的所有排序阶段，最后写回。这极大减少了显存带宽压力。
        </>
      )
    },
    step3: {
      title: "Warp Shuffle Optimization",
      desc: (
        <>
          当比较步长 j 小于 WARPSIZE (32) 时，不再读写 Shared Memory，而是使用 <code>__shfl_xor_sync</code> 直接在 Warp 内部的寄存器之间交换数据。
        </>
      )
    },
    step4: {
      title: "Consolidated Merge (Multi-Tile)",
      desc: (
        <>
          <strong className="text-white">作用:</strong> 让一个 Block 处理 <code>BLKSIZE * 2</code> 个元素。一次性缓存两块数据，在 Shared Memory 中完成最初几步的归并，减少 Kernel 启动次数。
        </>
      )
    },
    step5: {
      title: "Inline Padding",
      desc: (
        <>
          <strong className="text-white">作用:</strong> 代码没有单独编写“Padding Kernel”。在数据加载阶段，直接使用 <code>if (globalIdx &lt; activeSize)</code> 判断。如果越界，直接赋值 PADVAL (UINT16_MAX)。
        </>
      )
    },
    step6: {
      title: "Vectorized Global Merge (128-bit)",
      desc: (
        <>
          通过 <code>(int4*)data</code> 将指针重解释，每个线程一次性加载 128-bit (8个 uint16) 到寄存器。在寄存器内部手动解包、对比、重打包。
        </>
      )
    },
    step7: {
      title: "Hybrid Merge Strategy",
      desc: (
        <>
          主机端代码实现了一个混合调度策略：当步长 j &gt;= BLKSIZE 时，调用向量化的 bmerge_global_vectorized；当步长 j &lt; BLKSIZE 时，切换回使用 Shared Memory 的 bmerge_shared_k。
        </>
      )
    },
    step8: {
      title: "Async Execution (CUDA Streams)",
      desc: (
        <>
          在 s_init 中创建了 cudaStreamNonBlocking 类型的 Stream。所有的 Memcpy 和 Kernel Launch 都绑定到了这个 stream，允许 CPU 在 GPU 排序时并行处理其他任务。
        </>
      )
    },
    challenges: {
      title: "工程挑战 (Takeaways)"
    },
    chal1: {
      title: "非 2 次幂数据对齐",
      desc: (
        <>
          <span className="text-white">挑战:</span> Bitonic Sort 严格依赖 2^k 结构，直接处理会导致索引越界。<br />
          <span className="text-white">方案:</span> 实现了 <code>nextPow2</code> 计算，并在 Shared Mem 加载阶段利用 <code>PADVAL</code> (UINT16_MAX) 进行隐式填充，保证了排序正确性且无需额外 Padding Kernel。
        </>
      )
    },
    chal2: {
      title: "PyTorch 类型与符号兼容",
      desc: (
        <>
          <span className="text-white">挑战:</span> PyTorch <code>Int16</code> 是有符号的，而高性能排序网络通常基于无符号比较。<br />
          <span className="text-white">方案:</span> 通过 C++ Binding 层使用 <code>reinterpret_cast</code> 安全转换指针，并在 CUDA Stream 上调度，实现了与 PyTorch 生态的无缝集成。
        </>
      )
    },
    try: {
      title: "亲自尝试 (Try It Yourself)",
      desc: (
        <>
          想要亲手验证这些性能数据吗？我们在 Google Colab 上准备了完整的交互式 Notebook。
          <br /><br />
          <strong className="text-white">提示：</strong>请务必在 Colab 菜单中选择 <code>Runtime &gt; Change runtime type &gt; GPU</code>。
          <br />
          <strong className="text-white">性能差异说明：</strong>本页数据基于企业级 <strong>NVIDIA H100</strong> 采集。Colab 免费版提供的 <strong>T4 GPU</strong> 性能仅为 H100 的约 1/30，因此绝对耗时会较长，但相对于 CPU 的巨大加速比依然清晰可见。
        </>
      ),
      btn_colab: "Open in Colab",
      btn_src: "View Source"
    }
  },
  en: {
    nav: {
      overview: "Overview",
      benchmark: "Benchmarks",
      timeline: "Timeline",
      challenges: "Challenges"
    },
    hero: {
      desc: (
        <>
          A highly optimized Bitonic Sort implementation for NVIDIA H100/L40S architectures. Utilizing <span className="text-white font-medium">Shared Memory</span>, <span className="text-white font-medium">Warp Shuffle</span>, and <span className="text-white font-medium">Vectorized IO</span>, it achieves a <span className="text-brand-400 font-bold">260x</span> speedup compared to single-core CPU performance.
        </>
      )
    },
    kpi: {
      speedup: "Speedup vs CPU",
      latency: "100M Items Latency",
      throughput: "Elements / Sec",
      vector: "Vectorized IO"
    },
    arch: {
      title: "ARCHITECTURE DIAGRAM (Click to enlarge)",
      zoom: "Click to Zoom"
    },
    bench: {
      title: "Benchmarks",
      analysis_title: "Analysis: Startup Cost",
      analysis_text: (
        <>
          <strong className="text-brand-400">Low Overhead Advantage:</strong> For tiny batches (256 elements), PyTorch (based on RadixSort) takes <strong>0.103ms</strong>, whereas our Custom Kernel takes only <strong>0.014ms</strong>.
          <br /><br />
          This demonstrates a significant advantage in startup cost for TurboSort, making it ideal for scenarios with small batch sizes but frequent calls.
        </>
      ),
      peak_title: "Kernel Peak Throughput",
      peak_desc: (
        <>
          Calculation: <code>100M / 54.19ms</code>.<br />
          High throughput is enabled by the <code>int4</code> vectorized IO (Line 132 in kernel.cu), saturating HBM bandwidth.
        </>
      )
    },
    timeline: {
      title: "Optimization Timeline: From Baseline to SOTA"
    },
    step1: {
      title: "Baseline Implementation (Global Memory)",
      desc: (
        <>
          <strong className="text-white">Role:</strong> This is a standard Global Memory merge implementation where each thread independently reads two Global addresses, compares them, and writes back. This is the starting point for all optimizations.
        </>
      )
    },
    step2: {
      title: "Block-Level Sorting (Shared Memory)",
      desc: (
        <>
          <strong className="text-white">Role:</strong> Threads load data from Global to Shared Memory, complete all sorting stages from k=2 to k=BLKSIZE in on-chip memory, and finally write back. This drastically reduces VRAM bandwidth pressure.
        </>
      )
    },
    step3: {
      title: "Warp Shuffle Optimization",
      desc: (
        <>
          When the comparison stride j is less than WARPSIZE (32), Shared Memory operations are skipped in favor of <code>__shfl_xor_sync</code> for direct register-to-register communication within the Warp.
        </>
      )
    },
    step4: {
      title: "Consolidated Merge (Multi-Tile)",
      desc: (
        <>
          <strong className="text-white">Role:</strong> Allows one Block to process <code>BLKSIZE * 2</code> elements. It caches two chunks of data at once and completes the initial merge steps in Shared Memory, reducing Kernel launches.
        </>
      )
    },
    step5: {
      title: "Inline Padding",
      desc: (
        <>
          <strong className="text-white">Role:</strong> There is no separate &apos;Padding Kernel&apos;. During data loading, an <code>if (globalIdx &lt; activeSize)</code> check is used. If out of bounds, <code>PADVAL (UINT16_MAX)</code> is assigned directly.
        </>
      )
    },
    step6: {
      title: "Vectorized Global Merge (128-bit)",
      desc: (
        <>
          By reinterpreting the pointer with <code>(int4*)data</code>, each thread loads 128-bit (8 uint16s) into registers in one go. Manual unpacking, comparison, and repacking happen inside registers.
        </>
      )
    },
    step7: {
      title: "Hybrid Merge Strategy",
      desc: (
        <>
          The host code implements a hybrid scheduling strategy: when stride j &gt;= BLKSIZE, it calls the vectorized bmerge_global_vectorized; when j &lt; BLKSIZE, it switches back to bmerge_shared_k using Shared Memory.
        </>
      )
    },
    step8: {
      title: "Async Execution (CUDA Streams)",
      desc: (
        <>
          A cudaStreamNonBlocking stream is created in s_init. All Memcpy and Kernel Launches are bound to this stream, allowing the CPU to process other tasks in parallel while the GPU is sorting.
        </>
      )
    },
    challenges: {
      title: "Engineering Takeaways"
    },
    chal1: {
      title: "Non-Power-of-2 Data Alignment",
      desc: (
        <>
          <span className="text-white">Challenge:</span> Bitonic Sort strictly relies on a 2^k structure; direct processing leads to index out-of-bounds.<br />
          <span className="text-white">Solution:</span> Implemented <code>nextPow2</code> calculation and used <code>PADVAL</code> (UINT16_MAX) for implicit padding during the Shared Mem load phase, ensuring correctness without an extra Padding Kernel.
        </>
      )
    },
    chal2: {
      title: "PyTorch Type & Sign Compatibility",
      desc: (
        <>
          <span className="text-white">Challenge:</span> PyTorch <code>Int16</code> is signed, while high-performance sorting networks typically use unsigned comparison.<br />
          <span className="text-white">Solution:</span> Used <code>reinterpret_cast</code> in the C++ Binding layer for safe pointer conversion and scheduled it on the CUDA Stream to ensure seamless integration with the PyTorch ecosystem.
        </>
      )
    },
    try: {
      title: "Try It Yourself",
      desc: (
        <>
          Want to verify these performance numbers yourself? We have prepared a full interactive Notebook on Google Colab.<br /><br /><strong className="text-white">Tip:</strong> Make sure to select <code>Runtime &gt; Change runtime type &gt; GPU</code> in the Colab menu.<br /><strong className="text-white">Performance Note:</strong> The data on this page was collected on an enterprise-grade <strong>NVIDIA H100</strong>. The free <strong>T4 GPU</strong> provided by Colab is about 1/30th the performance of an H100, so absolute times will be higher, but the massive speedup vs CPU remains clear.
        </>
      ),
      btn_colab: "Open in Colab",
      btn_src: "View Source"
    }
  }
};

const MERMAID_GRAPH = `
graph LR
A["Host Input<br/>uint16 Array"] -->|Async H2D| B["Device Global Mem"]
B --> C{"Block Size?"}

subgraph GPU_Kernel
    direction TB
    C -- "Small Step" --> D["Shared Memory Sort<br/>(Warp Shuffle)"]
    C -- "Large Step" --> E["Global Merge"]
    E --> F["Vectorized IO<br/>(int4 Load/Store)"]
    F -->|Iterate| E
end

D --> G["Sorted Output"]
F --> G

style A fill:#0f172a,stroke:#334155,color:#fff
style B fill:#0f172a,stroke:#334155,color:#fff
style D fill:#1e293b,stroke:#0ea5e9,stroke-width:2px,color:#fff
style F fill:#1e293b,stroke:#a855f7,stroke-width:2px,color:#fff
`;

// --- Components ---

const CodeSnippet = ({ children }: { children: React.ReactNode }) => (
  <div className="code-snippet font-mono text-sm overflow-x-auto">
    <pre>{children}</pre>
  </div>
);

const TurboSortCudaPage = () => {
  const [lang, setLang] = useState<Lang>('zh');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>('');
  const mermaidRef = useRef<HTMLDivElement>(null);

  // Initialize Language from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang') === 'en' ? 'en' : 'zh';
    setLang(urlLang);
  }, []);

  const t = TRANSLATIONS[lang];

  const toggleLang = () => {
    const nextLang = lang === 'en' ? 'zh' : 'en';
    setLang(nextLang);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', nextLang);
    window.history.replaceState({}, '', url.toString());
  };

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      themeVariables: {
        primaryColor: '#0ea5e9',
        edgeLabelBackground: '#0f172a',
        darkMode: true,
        background: '#0f172a',
        lineColor: '#94a3b8'
      }
    });
  }, []);

  // Render Mermaid Graph
  useEffect(() => {
    const renderDiagram = async () => {
      if (mermaidRef.current) {
        try {
          const { svg } = await mermaid.render('mermaid-svg', MERMAID_GRAPH);
          mermaidRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid render error:', error);
        }
      }
    };
    renderDiagram();
  }, [lang]); // Re-render if lang changes (though graph is static here, good practice)

  // Open Modal logic (Snapshot SVG)
  const openModal = () => {
    const svgElement = mermaidRef.current?.querySelector('svg');
    if (svgElement) {
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svgElement);
      const encoded = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(source)));
      setModalImageSrc(encoded);
      setIsModalOpen(true);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  const chartData = useMemo(() => {
    const gradient = (context: ScriptableContext<'line'>) => {
        const ctx = context.chart.ctx;
        const g = ctx.createLinearGradient(0, 0, 0, 400);
        g.addColorStop(0, 'rgba(14, 165, 233, 0.5)');
        g.addColorStop(1, 'rgba(14, 165, 233, 0.0)');
        return g;
    };

    return {
      labels: ['256', '4K', '64K', '1M', '16M', '100M'],
      datasets: [
        {
          label: 'CPU (Single Core)',
          data: [0.022, 0.432, 7.744, 138.85, 2369.17, 16118.99],
          borderColor: '#475569',
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          tension: 0.4,
          pointRadius: 0
        },
        {
          label: 'CPU (64-Core Multi)',
          data: [0.014, 0.242, 0.624, 7.49, 210.60, 1335.97],
          borderColor: '#eab308',
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 2
        },
        {
          label: 'GPU Custom (Kernel)',
          data: [0.014, 0.047, 0.129, 0.389, 4.54, 54.19],
          borderColor: '#38bdf8',
          backgroundColor: gradient,
          fill: true,
          borderWidth: 3,
          pointBackgroundColor: '#0ea5e9',
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.3
        },
        {
          label: 'GPU Custom (Total)',
          data: [0.137, 0.165, 0.263, 0.62, 5.93, 62.00],
          borderColor: '#0ea5e9',
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderDash: [2, 2],
          pointRadius: 3
        },
        {
          label: 'PyTorch (torch.sort)',
          data: [0.103, 0.052, 0.309, 0.202, 0.712, 3.96],
          borderColor: '#a855f7', // Purple
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointBackgroundColor: '#a855f7',
          pointRadius: 4,
          tension: 0.3
        }
      ]
    };
  }, []);

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        legend: {
            labels: { color: '#cbd5e1', font: { family: 'Inter' } }
        },
        tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#fff',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            callbacks: {
                label: function(context: any) {
                    return context.dataset.label + ': ' + context.parsed.y + ' ms';
                }
            }
        }
    },
    scales: {
        y: {
            type: 'logarithmic',
            grid: { color: '#1e293b' },
            ticks: { color: '#64748b' },
            title: { 
                display: true, 
                text: 'Time (ms) - Log Scale', 
                color: '#475569' 
            }
        },
        x: {
            grid: { display: false },
            ticks: { color: '#64748b' }
        }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-300 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50 flex justify-between items-center">
        <Link href="/" className="font-bold text-white tracking-tight">
          TurboSort<span className="text-brand-500">.cuda</span>
        </Link>
        <div className="flex items-center space-x-4">
            <button 
                onClick={toggleLang}
                className="text-xs font-mono text-brand-400 border border-brand-500/30 px-2 py-1 rounded hover:bg-brand-500/10 transition-colors"
            >
                {lang === 'zh' ? 'EN' : '中'}
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
                <Menu />
            </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside 
        className={`
            fixed inset-0 z-40 bg-slate-900 border-r border-slate-800 overflow-y-auto transform transition-transform duration-300 ease-in-out
            md:translate-x-0 md:static md:flex md:flex-col md:w-64 md:h-screen md:sticky md:top-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-start">
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                    TurboSort<span className="text-brand-500">.cu</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1 font-mono">H100 OPTIMIZED SORT</p>
            </div>
            {/* Close button for mobile only */}
             <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
                <X />
             </button>
        </div>

        <div className="px-6 pt-4 pb-2">
            <Link href={`/?lang=${lang}`} className="w-full text-xs font-mono text-slate-400 border border-slate-700 px-2 py-1.5 rounded hover:bg-slate-800 transition-colors flex items-center justify-center mb-2">
                ← {lang === 'zh' ? '返回首页' : 'Back Home'}
            </Link>

            <button 
                onClick={toggleLang}
                className="w-full text-xs font-mono text-brand-400 border border-brand-500/30 px-2 py-1.5 rounded hover:bg-brand-500/10 transition-colors flex items-center justify-center"
            >
                <Languages className="w-3 h-3 mr-2" />
                <span>{lang === 'zh' ? 'Switch to English' : '切换到中文'}</span>
            </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-3">
            <a href="#overview" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-slate-800 group" onClick={() => setIsSidebarOpen(false)}>
                <LayoutDashboard className="w-4 h-4 mr-3 text-brand-500" />
                {t.nav.overview}
            </a>
            <a href="#benchmark" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:text-white hover:bg-slate-800 group" onClick={() => setIsSidebarOpen(false)}>
                <BarChart2 className="w-4 h-4 mr-3 group-hover:text-brand-500 transition-colors" />
                {t.nav.benchmark}
            </a>
            <a href="#timeline" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:text-white hover:bg-slate-800 group" onClick={() => setIsSidebarOpen(false)}>
                <GitCommit className="w-4 h-4 mr-3 group-hover:text-brand-500 transition-colors" />
                {t.nav.timeline}
            </a>
            <a href="#challenges" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:text-white hover:bg-slate-800 group" onClick={() => setIsSidebarOpen(false)}>
                <Cpu className="w-4 h-4 mr-3 group-hover:text-brand-500 transition-colors" />
                {t.nav.challenges}
            </a>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-xs text-slate-400 font-mono">Status: Functional</span>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto w-full overflow-x-hidden">
        
        {/* Overview Section */}
        <section id="overview" className="mb-20 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col xl:flex-row gap-8 items-start justify-between">
                <div className="flex-1">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-4">
                        CUDA High Performance Computing
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        TurboSort <br />
                        <span className="text-slate-500">Optimization Report</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                        {t.hero.desc}
                    </p>
                </div>
                
                {/* KPI Cards */}
                <div className="grid grid-cols-2 gap-4 w-full xl:w-auto min-w-[300px]">
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                        <div className="text-3xl font-bold text-white">260x</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{t.kpi.speedup}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                        <div className="text-3xl font-bold text-brand-500">54ms</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{t.kpi.latency}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                        <div className="text-3xl font-bold text-white">1.8B</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{t.kpi.throughput}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                        <div className="text-3xl font-bold text-accent-purple">Int4</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{t.kpi.vector}</div>
                    </div>
                </div>
            </div>

            {/* Architecture Flow */}
            <div className="mt-10 bg-slate-900 border border-slate-800 rounded-xl p-1 overflow-hidden">
                <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">{t.arch.title}</span>
                    <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    </div>
                </div>
                
                {/* Clickable Container for Diagram */}
                <div 
                    id="diagram-container" 
                    className="p-6 flex justify-center w-full relative group transition-colors hover:bg-slate-800/50 cursor-zoom-in" 
                    onClick={openModal}
                >
                    <div className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg text-brand-400 opacity-0 group-hover:opacity-100 transition-all shadow-lg border border-slate-700 z-10 flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-300">{t.arch.zoom}</span>
                        <Maximize2 className="w-4 h-4" />
                    </div>
                    <div ref={mermaidRef} className="mermaid flex justify-center w-full">
                         {/* Mermaid SVG will be injected here */}
                         Loading Diagram...
                    </div>
                </div>
            </div>
        </section>

        {/* Benchmark Section */}
        <section id="benchmark" className="mb-24 scroll-mt-24">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center">
                    <BarChart2 className="mr-3 text-brand-500" />
                    <span>{t.bench.title}</span>
                </h2>
                <div className="hidden sm:flex space-x-2">
                     <span className="px-2 py-1 text-xs font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">H100 80GB</span>
                     <span className="px-2 py-1 text-xs font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">Full Scale Analysis</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Chart Area */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 relative min-h-[400px]">
                    <Line data={chartData} options={chartOptions} />
                </div>

                {/* Analysis Sidebar */}
                <div className="space-y-4">
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                        <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wide">{t.bench.analysis_title}</h3>
                        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                            {t.bench.analysis_text}
                        </p>
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">PyTorch (256 items)</span>
                                <span className="text-white font-mono">0.103 ms</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                <div className="bg-accent-purple h-full" style={{ width: '100%' }}></div>
                            </div>
                            
                            <div className="flex justify-between text-xs">
                                <span className="text-brand-400 font-bold">Custom Kernel (256 items)</span>
                                <span className="text-brand-400 font-mono font-bold">0.014 ms</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                <div className="bg-brand-500 h-full" style={{ width: '13%' }}></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs text-slate-500">{t.bench.peak_title}</span>
                            <span className="text-xl font-bold text-white">1.85B <span className="text-xs text-slate-500 font-normal">elems/s</span></span>
                        </div>
                        <div className="text-xs text-slate-400 leading-relaxed">
                            {t.bench.peak_desc}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Timeline Section */}
        <section id="timeline" className="mb-24 scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-10 flex items-center">
                <GitCommit className="mr-3 text-brand-500" />
                <span>{t.timeline.title}</span>
            </h2>

            <div className="relative pl-6">
                {/* Step 1 */}
                <div className="relative pl-10 pb-12 group last-item">
                    <div className="timeline-line"></div>
                    <div className="absolute left-0 top-0 w-12 h-12 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 font-bold group-hover:border-brand-500 group-hover:text-white transition-colors z-10">1</div>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-colors">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                            <h3 className="text-lg font-bold text-white">{t.step1.title}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-500 border border-slate-700">bmerge_global_k</span>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-slate-400 leading-relaxed mb-3">
                                    {t.step1.desc}
                                </p>
                            </div>
                            <CodeSnippet>
{`__global__ void bmerge_global_k(...) {
  // Standard Global Memory Compare-Swap
  DTYPE v1 = data[idx];
  DTYPE v2 = data[ixj];
  if (ascending ? (v1 > v2) : (v1 < v2)) {
      data[idx] = v2; data[ixj] = v1;
  }
}`}
                            </CodeSnippet>
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-10 pb-12 group last-item">
                    <div className="timeline-line"></div>
                    <div className="absolute left-0 top-0 w-12 h-12 bg-slate-900 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 font-bold z-10">2</div>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                            <h3 className="text-lg font-bold text-white">{t.step2.title}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-500 border border-slate-700">bsort_shared_k</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-3">
                            {t.step2.desc}
                        </p>
                        <CodeSnippet>
{`extern __shared__ DTYPE shared[];
shared[tid] = data[globalIdx]; // Load to L1
__syncthreads();
// Sort in Shared Memory...`}
                        </CodeSnippet>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-10 pb-12 group last-item">
                    <div className="timeline-line"></div>
                    <div className="absolute left-0 top-0 w-12 h-12 bg-brand-600 border border-white/20 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">3</div>
                    
                    <div className="bg-slate-900 border border-brand-500/30 rounded-xl p-6 hover:border-brand-500/50 transition-colors">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                            <h3 className="text-lg font-bold text-white">{t.step3.title}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-900/20 text-brand-400 border border-brand-500/20">Inside bsort_shared_k</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                            {t.step3.desc}
                        </p>
                        <CodeSnippet>
{`while (j > 0) {
    DTYPE other = __shfl_xor_sync(mask, val, j, 32);
    // Register-level swap
    if (val < other) ...
    j = j / 2;
}`}
                        </CodeSnippet>
                    </div>
                </div>

                {/* Step 4 */}
                <div className="relative pl-10 pb-12 group last-item">
                    <div className="timeline-line"></div>
                    <div className="absolute left-0 top-0 w-12 h-12 bg-slate-900 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 font-bold z-10">4</div>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                            <h3 className="text-lg font-bold text-white">{t.step4.title}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-500 border border-slate-700">bmerge_first_k</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-3">
                            {t.step4.desc}
                        </p>
                        <CodeSnippet>
{`size_t pairElements = BLKSIZE * 2;
// Process larger tile in shared memory`}
                        </CodeSnippet>
                    </div>
                </div>

                {/* Step 5 */}
                <div className="relative pl-10 pb-12 group last-item">
                    <div className="timeline-line"></div>
                    <div className="absolute left-0 top-0 w-12 h-12 bg-slate-900 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 font-bold z-10">5</div>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                            <h3 className="text-lg font-bold text-white">{t.step5.title}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-500 border border-slate-700">Dynamic Bounds Check</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                           {t.step5.desc}
                        </p>
                        <CodeSnippet>
{`if (idx < active) val = data[idx];
else val = PADVAL; // No extra kernel needed`}
                        </CodeSnippet>
                    </div>
                </div>

                {/* Step 6 */}
                <div className="relative pl-10 pb-12 group last-item">
                    <div className="timeline-line"></div>
                    <div className="absolute left-0 top-0 w-12 h-12 bg-accent-purple border border-white/20 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">6</div>
                    
                    <div className="bg-slate-900 border border-accent-purple/40 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">{t.step6.title}</h3>
                            <span className="text-xs font-mono text-purple-400 bg-purple-900/20 px-2 py-1 rounded">bmerge_global_vectorized</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                            {t.step6.desc}
                        </p>
                        <CodeSnippet>
{`__global__ void bmerge_global_vectorized(...) {
    int4* ptr = (int4*)data;
    int4 v_self = ptr[idx]; // Load 128-bit vector
    // Manual unpack & sort in registers...
}`}
                        </CodeSnippet>
                    </div>
                </div>

                 {/* Step 7 */}
                 <div className="relative pl-10 pb-12 group last-item">
                    <div className="timeline-line"></div>
                    <div className="absolute left-0 top-0 w-12 h-12 bg-slate-900 border border-brand-500 rounded-full flex items-center justify-center text-brand-500 font-bold shadow-[0_0_15px_rgba(14,165,233,0.2)] z-10">7</div>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-brand-500/30 transition-colors">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                            <h3 className="text-lg font-bold text-white">{t.step7.title}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-900/20 text-brand-400 border border-brand-500/20">s_run Dispatch</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                            {t.step7.desc}
                        </p>
                        <CodeSnippet>
{`if (j >= BLKSIZE) 
    bmerge_global_vectorized<<<...>>>(...);
else 
    bmerge_shared_k<<<...>>>(...);`}
                        </CodeSnippet>
                    </div>
                </div>

                {/* Step 8 */}
                <div className="relative pl-10 group">
                    <div className="absolute left-0 top-0 w-12 h-12 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-slate-500 font-bold z-10">8</div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-2">{t.step8.title}</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            {t.step8.desc}
                        </p>
                         <CodeSnippet>
{`cudaStreamCreateWithFlags(&s->stream, cudaStreamNonBlocking);
// All kernels launched on s->stream`}
                        </CodeSnippet>
                    </div>
                </div>
            </div>
        </section>

        {/* Challenges Section */}
        <section id="challenges" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                <Cpu className="mr-3 text-brand-500" />
                <span>{t.challenges.title}</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-600 transition-colors">
                    <div className="flex items-start mb-3">
                        <div className="p-2 bg-red-500/10 rounded-lg mr-3"><AlertOctagon className="w-5 h-5 text-red-400" /></div>
                        <div>
                            <h3 className="text-white font-bold">{t.chal1.title}</h3>
                            <div className="text-xs text-slate-500 font-mono mt-1">ALGORITHMIC EDGE CASE</div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {t.chal1.desc}
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-600 transition-colors">
                    <div className="flex items-start mb-3">
                        <div className="p-2 bg-yellow-500/10 rounded-lg mr-3"><Layers className="w-5 h-5 text-yellow-400" /></div>
                        <div>
                            <h3 className="text-white font-bold">{t.chal2.title}</h3>
                            <div className="text-xs text-slate-500 font-mono mt-1">SYSTEM INTEGRATION</div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {t.chal2.desc}
                    </p>
                </div>
            </div>
        </section>

        {/* Try It Yourself Section */}
        <section id="try-it" className="mb-24 scroll-mt-24">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 lg:p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                    <PlayCircle className="w-48 h-48 text-brand-500" />
                </div>
                
                <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent-orange/10 text-accent-orange text-xs font-medium mb-4 border border-accent-orange/20">
                        <span className="w-2 h-2 rounded-full bg-accent-orange mr-2 animate-pulse"></span>
                        Interactive Demo
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">{t.try.title}</h2>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                        {t.try.desc}
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                        <a href="https://colab.research.google.com/drive/1pVf_3wVXn47hfvbLXMewig3FG24BWg7t?usp=sharing" target="_blank" className="inline-flex items-center px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-brand-500/25 group">
                            <Play className="w-5 h-5 mr-2 fill-current" />
                            <span>{t.try.btn_colab}</span>
                        </a>
                        <a href="https://github.com/haifengrein/TurboSort-CUDA" target="_blank" className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg border border-slate-700 transition-all">
                            <Github className="w-5 h-5 mr-2" />
                            <span>{t.try.btn_src}</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <footer className="border-t border-slate-800 pt-8 pb-12 text-center text-slate-500 text-xs font-mono">
            <p>&copy; 2025 CUDA Engineering Lab. Generated based on `kernel.cu` artifacts.</p>
        </footer>

      </main>

      {/* Image Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm transition-opacity cursor-pointer" onClick={closeModal}></div>
            
            {/* Content Container */}
            <div className="relative w-full h-full max-w-[95vw] max-h-[90vh] flex flex-col items-center justify-center pointer-events-none p-4">
                
                {/* Close Button */}
                <button onClick={closeModal} className="pointer-events-auto absolute top-4 right-4 z-50 p-2 bg-slate-800/80 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-700">
                    <X className="w-6 h-6" />
                </button>
                
                {/* Image Area */}
                <div className="pointer-events-auto w-full h-full flex items-center justify-center overflow-auto rounded-xl relative">
                    <Image 
                      src={modalImageSrc} 
                      alt="Architecture Diagram" 
                      fill
                      className="object-contain"
                      unoptimized
                    />
                </div>
                
                <p className="mt-4 text-slate-500 text-sm font-mono pointer-events-auto">
                    <span className="hidden md:inline">按 ESC 关闭 / </span>点击背景关闭
                </p>
            </div>
          </div>
      )}
    </div>
  );
};

export default TurboSortCudaPage;
