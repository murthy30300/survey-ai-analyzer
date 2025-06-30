import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Users, FileText, Clock, CheckCircle } from "lucide-react";

const API_BASE = 'https://mngp6096cl.execute-api.us-east-1.amazonaws.com/Prod';

interface DashboardSectionProps {
  userId: string | null;
}

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
  topic_sentiment_map?: Record<string, any>;
}

const fetchChartUrls = async (userId: string, uploadId: string): Promise<string[]> => {
  try {
    const res = await fetch(
      `${API_BASE}/chart-urls?user_id=${userId}&upload_id=${uploadId}`,
      { method: "GET" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.chart_urls || [];
  } catch {
    return [];
  }
};

const DashboardSection = ({ userId }: DashboardSectionProps) => {
  const [surveyHistory, setSurveyHistory] = useState<SurveyData[]>([]);
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartUrlsMap, setChartUrlsMap] = useState<Record<string, string[]>>({});
  const [stats, setStats] = useState({
    totalSurveys: 0,
    totalResponses: 0,
    completedAnalyses: 0,
    averageSatisfaction: 0,
  });

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch survey history
      const surveyResponse = await fetch(`${API_BASE}/surveys?user_id=${userId}`);
      if (surveyResponse.ok) {
        const surveyData = await surveyResponse.json();
        const surveys = surveyData.surveys || [];
        setSurveyHistory(surveys);

        // Fetch insights
        const insightsResponse = await fetch(`${API_BASE}/insights?user_id=${userId}`);
        if (insightsResponse.ok) {
          const insightsData = await insightsResponse.json();
          const insightsArray = insightsData.insights || [];
          setInsights(insightsArray);
          
          // Fetch chart URLs for each insight
          const chartUrlsObj: Record<string, string[]> = {};
          for (const insight of insightsArray) {
            chartUrlsObj[insight.upload_id] = await fetchChartUrls(
              userId,
              insight.upload_id
            );
          }
          setChartUrlsMap(chartUrlsObj);
          
          // Calculate stats from insights
          const totalResponses = insightsArray.reduce((sum: number, insight: InsightData) => sum + (insight.response_count || 0), 0);
          const totalSatisfaction = insightsArray.reduce((sum: number, insight: InsightData) => sum + (insight.avg_satisfaction || 0), 0);
          const avgSatisfaction = insightsArray.length > 0 ? totalSatisfaction / insightsArray.length : 0;
          const completedAnalyses = insightsArray.filter((insight: InsightData) => insight.avg_satisfaction > 0).length;

          setStats({
            totalSurveys: surveys.length,
            totalResponses,
            completedAnalyses,
            averageSatisfaction: Number(avgSatisfaction.toFixed(1)),
          });
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'analyzed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'raw':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-green-600';
      case 'mixed':
      case 'neutral':
        return 'text-yellow-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded-full" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <Clock className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Surveys</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSurveys}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalResponses.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Analyses</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedAnalyses}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Satisfaction</p>
                <p className="text-3xl font-bold text-gray-900">{stats.averageSatisfaction}</p>
                <p className="text-sm text-gray-500">out of 5.0</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest survey processing updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {surveyHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No surveys uploaded yet</p>
              ) : (
                surveyHistory.slice(0, 4).map((survey) => (
                  <div key={survey.upload_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {survey.status === 'analyzed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : survey.status === 'processing' ? (
                        <Clock className="h-5 w-5 text-blue-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-gray-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">Survey {survey.upload_id}</p>
                        <p className="text-sm text-gray-500">Uploaded {survey.timestamp}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className={getStatusColor(survey.status)}>
                        {survey.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {survey.analyzed_at ? `Analyzed ${survey.analyzed_at}` : 'Processing...'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Survey Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Survey Performance</CardTitle>
            <CardDescription>Satisfaction scores and sentiment analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No insights available yet</p>
              ) : (
                insights.slice(0, 4).map((insight, index) => (
                  <div key={insight.upload_id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">Survey {insight.upload_id}</span>
                        {getTrendIcon(insight.overall_sentiment)}
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">{insight.avg_satisfaction?.toFixed(1) || 'N/A'}</span>
                        <span className="text-sm text-gray-500">/5.0</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`capitalize ${getSentimentColor(insight.overall_sentiment)}`}>
                        {insight.overall_sentiment || 'Unknown'} sentiment
                      </span>
                      <span className="text-gray-500">{insight.response_count || 0} responses</span>
                    </div>
                    <Progress value={(insight.avg_satisfaction / 5) * 100} className="h-2" />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Survey Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Survey Charts</CardTitle>
          <CardDescription>Visual analytics for each survey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {insights.slice(0, 4).map((insight) => (
              <div key={insight.upload_id} className="border-b pb-6 last:border-b-0">
                <div className="font-medium mb-4 text-lg">
                  Survey {insight.upload_id}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.isArray(chartUrlsMap[insight.upload_id]) &&
                  chartUrlsMap[insight.upload_id].length > 0 ? (
                    chartUrlsMap[insight.upload_id].map((url, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg border shadow-sm">
                        <img
                          src={url}
                          alt={`Chart ${idx + 1} for Survey ${insight.upload_id}`}
                          className="w-full rounded-lg border"
                          style={{ maxHeight: 300, objectFit: "contain" }}
                          crossOrigin="anonymous"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex items-center justify-center py-8 text-gray-400 text-sm bg-gray-50 rounded-lg">
                      No charts available for this survey
                    </div>
                  )}
                </div>
              </div>
            ))}
            {insights.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No survey data available yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSection;
