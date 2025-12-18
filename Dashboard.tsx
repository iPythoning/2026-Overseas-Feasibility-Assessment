import React, { useEffect, useState } from 'react';
import { getStats } from './storage';
import { results } from './data';

interface DashboardProps {
    onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
    const [stats, setStats] = useState<{ total: number; avg: number; distribution: Record<string, number> } | null>(null);

    useEffect(() => {
        setStats(getStats());
    }, []);

    if (!stats) return <div>Loading...</div>;

    // Find max value for bar chart scaling
    const counts = Object.values(stats.distribution) as number[];
    const maxCount = Math.max(0, ...counts);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">行业出海可行性大数据看板</h2>
                <button 
                    onClick={onBack}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    &larr; 返回首页
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">累计评估企业</div>
                    <div className="mt-2 text-4xl font-extrabold text-blue-600">{stats.total}</div>
                    <div className="text-sm text-gray-400 mt-1">家企业参与自测</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">行业平均分</div>
                    <div className="mt-2 text-4xl font-extrabold text-green-600">{stats.avg}</div>
                    <div className="text-sm text-gray-400 mt-1">满分 100 分</div>
                </div>
            </div>

            {/* Distribution Chart */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-6">企业类型分布</h3>
                <div className="space-y-6">
                    {results.map((r, idx) => {
                        const count = stats.distribution[r.title] || 0;
                        const percentage = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0;
                        const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
                        
                        return (
                            <div key={idx} className="relative">
                                <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                                    <span>{r.title}</span>
                                    <span>{count}家 ({percentage}%)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                    <div 
                                        className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                                            idx === 0 ? 'bg-yellow-400' :
                                            idx === 1 ? 'bg-blue-400' :
                                            idx === 2 ? 'bg-cyan-400' :
                                            idx === 3 ? 'bg-gray-400' : 'bg-red-400'
                                        }`}
                                        style={{ width: `${Math.max(barWidth, 2)}%` }} // min width for visibility
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{r.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Insights Section */}
            <div className="bg-blue-900 text-white p-8 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold mb-4">数据洞察</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-semibold text-blue-200 mb-2">主要挑战</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm opacity-90">
                            <li>45% 的内贸企业严重低估了出海所需的"无回报承受资金"。</li>
                            <li>超过 60% 的初创团队缺乏合规风控意识（专利/商标）。</li>
                        </ul>
                    </div>
                    <div>
                         <h4 className="font-semibold text-blue-200 mb-2">成功要素</h4>
                         <ul className="list-disc list-inside space-y-2 text-sm opacity-90">
                            <li>高分企业普遍拥有 "每天1小时深度参与" 的一把手。</li>
                            <li>"小单快返"的柔性供应链是评分 80+ 企业的标配。</li>
                         </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;