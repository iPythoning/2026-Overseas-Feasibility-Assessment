
import React, { useEffect, useState } from 'react';
import { dimensions, results } from './data';
import { AnswersMap } from './types';
import { saveAssessment, saveContactSubmission } from './storage';

interface ResultProps {
  answers: AnswersMap;
  onRestart: () => void;
  onDashboard: () => void;
}

const Result: React.FC<ResultProps> = ({ answers, onRestart, onDashboard }) => {
  const [score, setScore] = useState(0);
  const [resultCategory, setResultCategory] = useState(results[results.length - 1]);
  const [dimensionScores, setDimensionScores] = useState<Record<string, number>>({});
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', phone: '', company: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Multi-Channel Sync States
  const [notionSync, setNotionSync] = useState<'idle' | 'success' | 'error'>('idle');
  const [emailNotify, setEmailNotify] = useState<'idle' | 'success' | 'error'>('idle');
  const [sheetsSync, setSheetsSync] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    let total = 0;
    const dims: Record<string, number> = {};

    dimensions.forEach(dim => {
      let dimScore = 0;
      dim.questions.forEach(q => {
        const selectedIndices = answers[q.id] || [];
        if (q.type === 'multiple') {
            let rawScore = 0;
            selectedIndices.forEach(idx => {
                rawScore += q.options[idx].score;
            });
            if (q.maxScore) {
                rawScore = Math.min(rawScore, q.maxScore);
            }
            dimScore += rawScore;
        } else {
            if (selectedIndices.length > 0) {
                dimScore += q.options[selectedIndices[0]].score;
            }
        }
      });
      dims[dim.id] = dimScore;
      total += dimScore;
    });

    setScore(total);
    setDimensionScores(dims);

    const category = results.find(r => total >= r.min && total <= r.max);
    if (category) {
        setResultCategory(category);
        saveAssessment(total, category, dims);
    }
  }, [answers]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotionSync('idle');
    setEmailNotify('idle');
    setSheetsSync('idle');
    
    const submissionData = {
        name: contactForm.name,
        phone: contactForm.phone,
        company: contactForm.company,
        score: score,
        categoryTitle: resultCategory.title,
        source: '2026 Overseas Assessment Tool',
        submissionDate: new Date().toISOString(),
        localTime: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
    };

    // 1. Local Persistence (Safety First)
    saveContactSubmission(submissionData);

    // --- External Integrations ---
    // Make.com flows for Notion and Email
    const NOTION_WEBHOOK = 'https://hook.us2.make.com/99om425n81mvqqruaeekingcpg8h98qx'; 
    const EMAIL_NOTIFY_WEBHOOK = 'https://hook.us2.make.com/99om425n81mvqqruaeekingcpg8h98qx';
    // Google Sheets Apps Script Web App URL
    const SHEETS_WEBHOOK = 'https://script.google.com/macros/s/AKfycbzgWnU7do9Q5kWK8QnfbpvI-j-P4AD9Bj7vA0Lbpei3_VaPmZG_D7XCwZPTQwJUnI_r/exec';

    try {
        // Parallel execution for best UX
        const results = await Promise.allSettled([
            // Sync to Notion
            fetch(NOTION_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData)
            }),
            // Notify Admin
            fetch(EMAIL_NOTIFY_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...submissionData, _triggerEmail: true })
            }),
            // Log to Google Sheets
            fetch(SHEETS_WEBHOOK, {
                method: 'POST',
                mode: 'no-cors', // Apps Script requires no-cors for simple POST redirection
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(submissionData)
            })
        ]);

        // Update Sync Statuses
        if (results[0].status === 'fulfilled' && (results[0].value as Response).ok) setNotionSync('success');
        else setNotionSync('error');

        if (results[1].status === 'fulfilled') setEmailNotify('success');
        else setEmailNotify('error');

        if (results[2].status === 'fulfilled') setSheetsSync('success');
        else setSheetsSync('error');

        setFormSubmitted(true);
        
        // Scroll to the unlocked action items
        setTimeout(() => {
          document.getElementById('action-items-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    } catch (error) {
        console.error('Integration error:', error);
        setFormSubmitted(true); // Don't block the user
    } finally {
        setIsSubmitting(false);
    }
  };

  const getStarColor = (index: number) => {
    return index < resultCategory.stars ? 'text-yellow-400' : 'text-gray-300';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* 1. PRIMARY SCORE CARD */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in">
        <div className={`p-12 text-center ${
            score >= 90 ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600' :
            score >= 70 ? 'bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700' :
            score >= 50 ? 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500' :
            'bg-gradient-to-br from-slate-600 via-gray-700 to-slate-800'
        } text-white`}>
          <div className="text-xs font-black uppercase tracking-[0.5em] mb-4 opacity-70">Overseas Readiness Score</div>
          <div className="text-9xl font-black mb-4 drop-shadow-xl tracking-tighter">{score}</div>
          <h2 className="text-4xl font-bold mb-6 tracking-tight">{resultCategory.title}</h2>
          <div className="flex justify-center space-x-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-10 h-10 ${getStarColor(i)} drop-shadow-md`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <div className="inline-flex items-center gap-3 px-8 py-3 bg-black/20 backdrop-blur-xl rounded-full font-bold text-sm tracking-widest border border-white/10 uppercase">
             核心特征：{resultCategory.priority}
          </div>
        </div>
        
        <div className="p-10 md:p-14 bg-white">
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                        结果解读
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm lg:text-base font-medium">{resultCategory.description}</p>
                </div>
                <div>
                    <h3 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                        预期成果
                    </h3>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-100 to-indigo-100 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <p className="relative text-emerald-700 font-bold bg-emerald-50/80 backdrop-blur-sm p-6 rounded-xl border border-emerald-100/50 italic text-sm lg:text-base leading-relaxed">
                            "{resultCategory.outcome}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 2. CONVERSION SECTION */}
      <div className={`transition-all duration-700 ${formSubmitted ? 'opacity-60 scale-[0.98]' : 'scale-100'}`}>
        <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden text-white border border-slate-800">
            <div className="p-10 md:p-16 flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                    <div className="inline-block px-4 py-1.5 bg-indigo-500 rounded text-[11px] font-black tracking-[0.2em] uppercase mb-6 shadow-lg shadow-indigo-500/20">
                        Unlock Strategy
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black mb-8 leading-[1.1] tracking-tight text-white">
                        获取您的<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">专属出海行动清单</span>
                    </h3>
                    <p className="text-slate-400 mb-10 text-lg font-medium leading-relaxed">
                        基于您的测评得分，PulseAgent 已生成定制化出海策略。填写信息解锁清单，数据将实时同步至我们的专家库与 Google Sheets。
                    </p>
                    
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4 text-xs text-slate-400 font-bold bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+40}`} alt="Expert" className="w-10 h-10 rounded-full border-2 border-slate-900 shadow-xl" />
                                ))}
                            </div>
                            <span className="leading-snug text-[10px] uppercase tracking-wider font-black">
                                <span className="text-white">Active Record Keeping:</span><br/>
                                Notion + Email + Google Sheets
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="lg:w-1/2 w-full">
                    <div className="bg-white p-10 rounded-2xl shadow-3xl text-slate-900 relative">
                        {!formSubmitted ? (
                            <form onSubmit={handleContactSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">您的称呼</label>
                                    <input type="text" required placeholder="如：王经理" className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">联系方式</label>
                                    <input type="text" required placeholder="手机或微信号" className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold" value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">企业名称</label>
                                    <input type="text" placeholder="公司全称 (可选)" className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold" value={contactForm.company} onChange={e => setContactForm({...contactForm, company: e.target.value})} />
                                </div>
                                
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting} 
                                    className={`w-full py-5 rounded-2xl font-black text-white transition-all shadow-2xl flex flex-col items-center justify-center gap-1 mt-6 ${
                                        isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-3">
                                            <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            <span className="text-lg">多渠道同步中...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-lg uppercase tracking-wider">立即解锁并预约指导</span>
                                            <span className="text-[10px] opacity-60 font-black">SYNC TO CLOUD + SHEETS</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-8 px-4 animate-scale-in">
                                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 mb-1">Lead Captured!</h4>
                                <p className="text-slate-500 font-bold text-xs mb-8">数据已成功同步至全球管理系统</p>
                                
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                            <span className="text-[10px] font-black text-indigo-800 uppercase tracking-widest">Notion DB</span>
                                        </div>
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded ${notionSync === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                            {notionSync === 'success' ? 'SYNCED' : 'PENDING'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-100">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                            <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Admin Email</span>
                                        </div>
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded ${emailNotify === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                            {emailNotify === 'success' ? 'NOTIFIED' : 'PENDING'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
                                            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Google Sheet</span>
                                        </div>
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded ${sheetsSync === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                            {sheetsSync === 'success' ? 'LOGGED' : 'PENDING'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 3. ACTION LIST */}
      <div id="action-items-section" className="relative group scroll-mt-24">
        {!formSubmitted && (
            <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-md bg-white/40 rounded-3xl border-2 border-dashed border-gray-200 p-8 text-center">
                <div className="max-w-sm">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <h4 className="text-xl font-black text-gray-900 mb-3">行动清单暂未解锁</h4>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-tighter italic">完成上方预约，立即解锁针对您 {score} 分情况的建议。</p>
                </div>
            </div>
        )}

        <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 p-10 md:p-14 transition-all duration-1000 ${!formSubmitted ? 'blur-sm grayscale opacity-30 select-none' : 'opacity-100'}`}>
            <h3 className="text-2xl font-black text-gray-900 mb-10 flex items-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mr-5">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                </div>
                针对性行动清单
            </h3>
            <div className="grid sm:grid-cols-2 gap-8">
                {resultCategory.advice.map((item, idx) => (
                    <div key={idx} className="group p-8 rounded-2xl border-2 border-gray-50 bg-slate-50 hover:bg-white hover:shadow-2xl hover:border-indigo-100 transition-all cursor-default">
                        <div className="flex items-start">
                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-xs mr-5 mt-1">
                                {idx + 1}
                            </span>
                            <span className="text-gray-700 font-bold leading-relaxed text-sm lg:text-base">{item}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row gap-5 justify-center pt-10">
        <button onClick={onRestart} className="px-12 py-5 bg-white text-slate-500 font-black rounded-2xl border-2 border-slate-200 hover:border-slate-400 transition-all text-xs uppercase tracking-[0.2em]">重新测评</button>
        <button onClick={onDashboard} className="px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all text-xs uppercase tracking-[0.2em]">查看大数据</button>
      </div>
    </div>
  );
};

export default Result;
