import { SavedAssessment, ResultCategory, ContactSubmission } from './types';
import { results } from './data';

const STORAGE_KEY = 'assessment_results_db_v1';
const CONTACT_STORAGE_KEY = 'contact_submissions_db_v1';

// Seed some dummy data if empty for visualization purposes
const seedData = (): SavedAssessment[] => {
  const dummy: SavedAssessment[] = [
    { id: '1', date: new Date(Date.now() - 86400000 * 2).toISOString(), totalScore: 85, categoryTitle: '快速迭代型 (重点培养)', dimensionScores: {} },
    { id: '2', date: new Date(Date.now() - 86400000 * 5).toISOString(), totalScore: 45, categoryTitle: '谨慎观望型 (谨慎观望)', dimensionScores: {} },
    { id: '3', date: new Date(Date.now() - 86400000 * 10).toISOString(), totalScore: 95, categoryTitle: '立即行动型 (黄金选手)', dimensionScores: {} },
    { id: '4', date: new Date(Date.now() - 86400000 * 1).toISOString(), totalScore: 60, categoryTitle: '准备就绪型 (需补足短板)', dimensionScores: {} },
    { id: '5', date: new Date().toISOString(), totalScore: 20, categoryTitle: '暂不适宜型 (暂不适合)', dimensionScores: {} },
  ];
  return dummy;
};

export const getAssessments = (): SavedAssessment[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = seedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw);
};

export const saveAssessment = (score: number, category: ResultCategory, dimensionScores: Record<string, number>) => {
  const current = getAssessments();
  const newEntry: SavedAssessment = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    totalScore: score,
    categoryTitle: category.title,
    dimensionScores
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newEntry, ...current]));
};

export const getStats = () => {
  const data = getAssessments();
  const total = data.length;
  if (total === 0) return { total: 0, avg: 0, distribution: {} as Record<string, number> };

  const sum = data.reduce((acc, curr) => acc + curr.totalScore, 0);
  const avg = Math.round(sum / total);

  const distribution: Record<string, number> = {};
  results.forEach(r => distribution[r.title] = 0);
  
  data.forEach(d => {
    if (distribution[d.categoryTitle] !== undefined) {
      distribution[d.categoryTitle]++;
    } else {
        // Fallback for potentially changed titles
        distribution[d.categoryTitle] = 1;
    }
  });

  return {
    total,
    avg,
    distribution
  };
};

export const getContactSubmissions = (): ContactSubmission[] => {
  const raw = localStorage.getItem(CONTACT_STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
};

export const saveContactSubmission = (submission: Omit<ContactSubmission, 'id' | 'date'>) => {
  const current = getContactSubmissions();
  const newEntry: ContactSubmission = {
    ...submission,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify([newEntry, ...current]));
};