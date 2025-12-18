
import React, { useState } from 'react';
import Intro from './Intro';
import Assessment from './Assessment';
import Result from './Result';
import Dashboard from './Dashboard';
import { AnswersMap } from './types';

type View = 'intro' | 'assessment' | 'result' | 'dashboard';

/**
 * Refined SVG based on the user's uploaded asset.
 * Tighter viewBox and paths to match the "smaller/cropped" look.
 */
const PulseLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* The 'A' Shape - Refined for better proportions */}
    <path 
      d="M50 5L10 95H32L40 75H60L68 95H90L50 5ZM50 28L56 48H44L50 28Z" 
      fill="#9A85FF" 
    />
    {/* The Pulse Line - Centered and thick like the provided asset */}
    <path 
      d="M8 58H35L44 42L56 74L65 58H92" 
      stroke="#ED509E" 
      strokeWidth="10" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

function App() {
  const [view, setView] = useState<View>('intro');
  const [answers, setAnswers] = useState<AnswersMap>({});

  const startAssessment = () => {
    setAnswers({});
    setView('assessment');
  };

  const finishAssessment = (finalAnswers: AnswersMap) => {
    setAnswers(finalAnswers);
    setView('result');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col overflow-x-hidden">
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-2 flex justify-between items-center">
            <a 
              href="https://pulseagent.io/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center space-x-2.5 group transition-all"
            >
                <div className="flex items-center justify-center transition-transform group-hover:scale-105">
                    <PulseLogo className="w-7 h-7" />
                </div>
                <div className="flex flex-col">
                    <span className="font-black text-base text-gray-900 leading-none tracking-tight group-hover:text-indigo-600 transition-colors">
                        PulseAgent
                    </span>
                    <span className="text-[8px] text-gray-400 uppercase tracking-widest font-extrabold leading-none mt-1">
                        Global AI
                    </span>
                </div>
            </a>
            
            <div className="flex items-center space-x-3">
                {view !== 'intro' && (
                    <button 
                      onClick={() => setView('intro')} 
                      className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 uppercase tracking-wider transition-colors px-2 py-1 rounded hover:bg-gray-50"
                    >
                        返回首页
                    </button>
                )}
                <a 
                  href="https://pulseagent.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-black text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-md shadow-sm transition-all hover:shadow-indigo-100 flex items-center gap-1"
                >
                  访问官网
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </a>
            </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12 flex-grow w-full">
        {view === 'intro' && (
          <Intro 
            onStart={startAssessment} 
            onDashboard={() => setView('dashboard')}
          />
        )}
        
        {view === 'assessment' && (
          <Assessment onComplete={finishAssessment} />
        )}
        
        {view === 'result' && (
          <Result 
            answers={answers} 
            onRestart={startAssessment}
            onDashboard={() => setView('dashboard')}
          />
        )}

        {view === 'dashboard' && (
            <Dashboard onBack={() => setView('intro')} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
        <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-4">
                    <PulseLogo className="w-5 h-5 opacity-70" />
                    <a href="https://pulseagent.io/" target="_blank" rel="noopener noreferrer" className="font-bold text-gray-400 hover:text-indigo-600 transition-colors tracking-tight text-sm">
                        PulseAgent.io
                    </a>
                </div>
                <p className="text-gray-400 text-[10px] mb-6 text-center max-w-xs leading-relaxed opacity-80 font-medium">
                    &copy; 2026 PulseAgent. All Rights Reserved. <br/>
                    基于 100+ 全球化商业案例深度建模，助力中国企业出海。
                </p>
                <div className="flex justify-center space-x-6 text-[9px] text-gray-300 uppercase tracking-[0.25em] font-black">
                    <span className="hover:text-indigo-300 cursor-default transition-colors">Security</span>
                    <span className="hover:text-indigo-300 cursor-default transition-colors">AI Insights</span>
                    <span className="hover:text-indigo-300 cursor-default transition-colors">Compliance</span>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
