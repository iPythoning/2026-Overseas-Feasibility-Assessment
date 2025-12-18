import React, { useState, useEffect } from 'react';
import { dimensions } from './data';
import { AnswersMap } from './types';

interface AssessmentProps {
  onComplete: (answers: AnswersMap) => void;
}

const Assessment: React.FC<AssessmentProps> = ({ onComplete }) => {
  const [currentDimIndex, setCurrentDimIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  
  // Flatten questions for progress bar
  const allQuestions = dimensions.flatMap(d => d.questions);
  const totalQuestions = allQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const currentDimension = dimensions[currentDimIndex];

  const handleSelect = (qId: number, optionIndex: number, type: 'single' | 'multiple') => {
    if (type === 'multiple') {
      setAnswers(prev => {
        const currentSelected = prev[qId] || [];
        if (currentSelected.includes(optionIndex)) {
          return { ...prev, [qId]: currentSelected.filter(i => i !== optionIndex) };
        } else {
          return { ...prev, [qId]: [...currentSelected, optionIndex] };
        }
      });
    } else {
      setAnswers(prev => ({ ...prev, [qId]: [optionIndex] }));
    }
  };

  const isDimensionComplete = () => {
    return currentDimension.questions.every(q => {
      const ans = answers[q.id];
      return ans && ans.length > 0;
    });
  };

  const handleNext = () => {
    if (currentDimIndex < dimensions.length - 1) {
      window.scrollTo(0, 0);
      setCurrentDimIndex(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentDimIndex > 0) {
      window.scrollTo(0, 0);
      setCurrentDimIndex(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8 bg-gray-200 rounded-full h-2.5 dark:bg-gray-200 w-full sticky top-4 z-10 shadow-sm">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-slate-800 p-6 text-white">
          <h2 className="text-xl font-bold">{currentDimension.title}</h2>
          <p className="opacity-80 text-sm mt-1">{currentDimension.description}</p>
        </div>

        <div className="p-6 md:p-8 space-y-10">
          {currentDimension.questions.map((q, idx) => (
            <div key={q.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                {q.id}. {q.text}
                {q.type === 'multiple' && <span className="text-xs ml-2 text-blue-600 bg-blue-50 px-2 py-1 rounded">多选</span>}
              </h3>
              <div className="space-y-3">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[q.id]?.includes(optIdx);
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx, q.type || 'single')}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all flex justify-between items-center ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-800'
                          : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentDimIndex === 0}
            className={`px-6 py-2 rounded-lg font-medium ${
              currentDimIndex === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            上一页
          </button>
          <button
            onClick={handleNext}
            disabled={!isDimensionComplete()}
            className={`px-8 py-2 rounded-lg font-bold text-white shadow-md transition-all ${
              !isDimensionComplete()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
            }`}
          >
            {currentDimIndex === dimensions.length - 1 ? '提交评估' : '下一页'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
