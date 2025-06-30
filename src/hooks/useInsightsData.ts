
import { useState, useEffect } from 'react';

const API_BASE = 'https://mngp6096cl.execute-api.us-east-1.amazonaws.com/Prod';

interface SurveyData {
  upload_id: string;
  status: string;
  timestamp: string;
  analyzed_at?: string;
}

interface InsightData {
  upload_id: string;
  avg_satisfaction: number;
  response_count: number;
  completed_analyses: number;
  overall_sentiment: string;
  pain_points?: string[];
  positive_aspects?: string[];
  top_insights?: string[];
  topic_sentiment_map?: Record<string, {
    avg_rating: number;
    positive_count: number;
    negative_count: number;
  }>;
}

export const useInsightsData = (userId: string | null) => {
  const [surveyHistory, setSurveyHistory] = useState<SurveyData[]>([]);
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);

      // Fetch survey history
      const surveyRes = await fetch(`${API_BASE}/surveys?user_id=${userId}`);
      if (surveyRes.ok) {
        const json = await surveyRes.json();
        setSurveyHistory(json.surveys || []);
      }

      // Fetch insights
      const insightRes = await fetch(`${API_BASE}/insights?user_id=${userId}`);
      if (insightRes.ok) {
        const json = await insightRes.json();
        setInsights(json.insights || []);
      }
    } catch (err) {
      console.error('Error fetching insights data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  return {
    surveyHistory,
    insights,
    loading,
    refetchData: fetchData
  };
};

export type { SurveyData, InsightData };
