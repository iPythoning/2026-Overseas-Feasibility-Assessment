import React, { useState } from 'react';
import Intro from './Intro';
import Assessment from './Assessment';
import Result from './Result';
import Dashboard from './Dashboard';
import { AnswersMap } from './types';

type View = 'intro' | 'assessment' | 'result' | 'dashboard';

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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">C</div>
                <span className="font-bold text-xl text-gray-800 tracking-tight">CrossBorder AI</span>
            </div>
            {view !== 'intro' && (
                <button onClick={() => setView('intro')} className="text-sm text-gray-500 hover:text-blue-600">
                    退出
                </button>
            )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
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

      <footer className="text-center py-6 text-gray-400 text-sm">
        &copy; 2026 PulseAgent出品 | 基于100+成功案例分析
      </footer>
    </div>
  );
}

export default App;
