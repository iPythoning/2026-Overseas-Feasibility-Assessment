import React from 'react';

interface IntroProps {
  onStart: () => void;
  onDashboard: () => void;
}

const Intro: React.FC<IntroProps> = ({ onStart, onDashboard }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        2026内贸企业出海可行性自测表
      </h1>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h3 className="font-bold text-blue-900 mb-2">评估说明</h3>
        <p className="text-blue-800 text-sm leading-relaxed mb-4">
          本表基于100+内贸转型外贸成败案例分析设计，共30题，满分100分。
          请企业实际控制人/CEO诚实作答，10分钟完成评估。
        </p>
        <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
          <li>本表需由<span className="font-bold">企业实际控制人</span>亲自填写</li>
          <li>每季度复测一次，跟踪进步</li>
          <li>结果仅供参考，转型决策需结合专业咨询</li>
        </ul>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <button
          onClick={onStart}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-md transition-all transform hover:scale-105 text-center text-lg"
        >
          开始测评
        </button>
        <button
          onClick={onDashboard}
          className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-8 rounded-lg border border-gray-300 shadow-sm transition-all text-center"
        >
          查看行业数据
        </button>
      </div>
    </div>
  );
};

export default Intro;
