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
    
    const submissionData = {
        name: contactForm.name,
        phone: contactForm.phone,
        company: contactForm.company,
        score: score,
        categoryTitle: resultCategory.title,
        submissionDate: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
    };

    console.log('--- 开始提交表单 ---');
    console.table(submissionData);

    // 1. 本地存储备份
    saveContactSubmission(submissionData);

    // --- 接口配置 ---
    const WEBHOOK_URL = 'https://hook.us2.make.com/99om425n81mvqqruaeekingcpg8h98qx'; 
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzgWnU7do9Q5kWK8QnfbpvI-j-P4AD9Bj7vA0Lbpei3_VaPmZG_D7XCwZPTQwJUnI_r/exec';

    const tasks = [];

    // 2. 发送至 Notion (Make)
    if (WEBHOOK_URL) {
        tasks.push(
            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData)
            })
            .then(res => {
                console.log('%cNotion (Make) 发送成功，状态码: ' + res.status, 'color: green; font-weight: bold');
                if (res.status !== 200) console.warn('警告：Make 返回了非 200 状态，请检查 Make 内部场景逻辑');
            })
            .catch(err => console.error('Notion 网络错误:', err))
        );
    }

    // 3. 发送至 Google Sheets
    if (GOOGLE_SCRIPT_URL) {
        tasks.push(
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', 
                cache: 'no-cache',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(submissionData)
            })
            .then(() => {
                console.log('%cGoogle Sheets 请求已发出', 'color: blue; font-weight: bold');
            })
            .catch(err => console.error('Google Sheets 网络错误:', err))
        );
    }

    await Promise.allSettled(tasks);
    
    setFormSubmitted(true);
    setIsSubmitting(false);
  };

  const getStarColor = (index: number) => {
    return index < resultCategory.stars ? 'text-yellow-400' : 'text-gray-300';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className={`p-8 text-center ${
            score >= 90 ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
            score >= 70 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
            score >= 50 ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
            'bg-gradient-to-r from-gray-600 to-gray-700'
        } text-white`}>
          <div className="text-6xl font-extrabold mb-2">{score}<span className="text-2xl font-normal">分</span></div>
          <h2 className="text-3xl font-bold mb-4">{resultCategory.title}</h2>
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-8 h-8 ${getStarColor(i)}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="opacity-90 text-lg">{resultCategory.priority}</p>
        </div>
        
        <div className="p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">结果解读</h3>
            <p className="text-gray-600 leading-relaxed mb-6">{resultCategory.description}</p>
            <h3 className="text-xl font-bold text-gray-800 mb-2">预期结果</h3>
            <p className="text-gray-600 leading-relaxed font-medium bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">{resultCategory.outcome}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            行动清单
        </h3>
        <ul className="space-y-4">
            {resultCategory.advice.map((item, idx) => (
                <li key={idx} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm mr-4">{idx + 1}</span>
                    <span className="text-gray-700 mt-1">{item}</span>
                </li>
            ))}
        </ul>
      </div>

      <div className="bg-gradient-to-br from-indigo-700 to-blue-800 rounded-xl shadow-xl overflow-hidden text-white relative">
        <div className="relative p-8 md:p-10 md:flex md:items-center md:gap-10">
            <div className="md:w-1/2 mb-8 md:mb-0">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">免费预约专家一对一指导</h3>
                <p className="text-blue-100 mb-6">获取深度商业诊断与资源对接建议。</p>
            </div>
            <div className="md:w-1/2">
                <div className="bg-white p-6 rounded-lg shadow-lg text-gray-800">
                    {!formSubmitted ? (
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                            <input type="text" required placeholder="您的称呼" className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} />
                            <input type="text" required placeholder="联系方式" className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none" value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} />
                            <input type="text" placeholder="企业名称" className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none" value={contactForm.company} onChange={e => setContactForm({...contactForm, company: e.target.value})} />
                            <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all">{isSubmitting ? '正在预约...' : '立即预约'}</button>
                        </form>
                    ) : (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <h4 className="text-xl font-bold">预约成功！</h4>
                            <p className="text-gray-500 text-sm mt-2">顾问将在24小时内联系您。</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <button onClick={onRestart} className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">重新测评</button>
        <button onClick={onDashboard} className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">查看行业看板</button>
      </div>
    </div>
  );
};

export default Result;