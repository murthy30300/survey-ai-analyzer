import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Download, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb,
  ThumbsUp,
  MessageSquare,
  BarChart3,
  Clock
} from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const API_BASE = 'https://mngp6096cl.execute-api.us-east-1.amazonaws.com/Prod';

interface InsightsSectionProps {
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
  topic_sentiment_map?: Record<string, {
    avg_rating: number;
    positive_count: number;
    negative_count: number;
  }>;
}

const InsightsSection = ({ userId }: InsightsSectionProps) => {
  const [surveyHistory, setSurveyHistory] = useState<SurveyData[]>([]);
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Poll for status updates
  useEffect(() => {
    if (polling && selectedSurvey && userId) {
      const interval = setInterval(() => {
        fetchData();
        // Check if the selected survey is now analyzed
        const survey = surveyHistory.find(s => s.upload_id === selectedSurvey);
        if (survey && survey.status === 'analyzed') {
          setPolling(false);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [polling, selectedSurvey, userId, surveyHistory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch survey history
      const surveyResponse = await fetch(`${API_BASE}/surveys?user_id=${userId}`);
      if (surveyResponse.ok) {
        const surveyData = await surveyResponse.json();
        setSurveyHistory(surveyData.surveys || []);
      }

      // Fetch insights
      const insightsResponse = await fetch(`${API_BASE}/insights?user_id=${userId}`);
      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();
        setInsights(insightsData.insights || []);
      }
    } catch (error) {
      console.error('Error fetching insights data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSurveySelect = (uploadId: string) => {
    setSelectedSurvey(uploadId);
    const survey = surveyHistory.find(s => s.upload_id === uploadId);
    if (survey && survey.status !== 'analyzed') {
      setPolling(true);
    }
  };

  const handleExportPDF = async () => {
    if (!pdfRef.current || !selectedSurvey) return;

    try {
      setExportLoading(true);
      
      // Create canvas from the PDF content
      const canvas = await html2canvas(pdfRef.current, {
        useCORS: true,
        scale: 2,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // If content is taller than one page, handle multiple pages
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        const pageHeight = pdf.internal.pageSize.getHeight();
        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
        }
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`Survey_Report_${selectedSurvey}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const getCurrentInsight = (): InsightData | null => {
    if (!selectedSurvey) return null;
    return insights.find(i => i.upload_id === selectedSurvey) || null;
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <Clock className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-2 text-gray-600">Loading insights...</p>
        </div>
      </div>
    );
  }

  const currentInsight = getCurrentInsight();
  const currentSurvey = surveyHistory.find(s => s.upload_id === selectedSurvey);

  return (
    <div className="space-y-6">
      {/* Survey Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Survey Analysis Results
          </CardTitle>
          <CardDescription>
            Select a survey to view detailed insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {surveyHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No surveys uploaded yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {surveyHistory.map((survey) => (
                <button
                  key={survey.upload_id}
                  onClick={() => handleSurveySelect(survey.upload_id)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    selectedSurvey === survey.upload_id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Survey {survey.upload_id}</h3>
                      <Badge 
                        variant="secondary" 
                        className={survey.status === 'analyzed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                      >
                        {survey.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{survey.timestamp}</p>
                    {polling && selectedSurvey === survey.upload_id && (
                      <p className="text-xs text-blue-600">Checking status...</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Insights - Wrapped in PDF ref */}
      {selectedSurvey && currentSurvey && (
        <div ref={pdfRef} className="space-y-6 pdf-content">
          {/* Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Survey {selectedSurvey} Analysis</CardTitle>
                  <CardDescription>
                    {currentSurvey.status === 'analyzed' ? 'Analysis completed' : 'Processing in progress'} • Uploaded on {currentSurvey.timestamp}
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportPDF}
                  disabled={!currentInsight || exportLoading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {exportLoading ? 'Generating...' : 'Export Report'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {currentInsight ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{currentInsight.avg_satisfaction?.toFixed(1) || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Overall Satisfaction</div>
                    <div className="text-xs text-gray-500">out of 5.0</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{currentInsight.response_count || 0}</div>
                    <div className="text-sm text-gray-600">Total Responses</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold capitalize ${getSentimentColor(currentInsight.overall_sentiment)}`}>
                      {currentInsight.overall_sentiment || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-600">Overall Sentiment</div>
                    <div className="text-xs text-gray-500">AI-powered analysis</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                  <p className="mt-2 text-gray-600">
                    {currentSurvey.status === 'analyzed' ? 'Loading insights...' : 'Analysis in progress...'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {currentInsight && (
            <div className="pdf-tabs-content">
              {/* Summary */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Analysis Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Key Metrics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Average Satisfaction: {currentInsight.avg_satisfaction?.toFixed(1)}/5.0</div>
                        <div>Response Count: {currentInsight.response_count}</div>
                        <div>Overall Sentiment: {currentInsight.overall_sentiment}</div>
                        <div>Completed Analyses: {currentInsight.completed_analyses}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pain Points */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentInsight.pain_points && currentInsight.pain_points.length > 0 ? (
                      currentInsight.pain_points.map((point, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 border-l-4 border-red-200 bg-red-50 rounded-r-lg">
                          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{point}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No specific pain points identified</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Positive Aspects */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                    What's Working Well
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentInsight.positive_aspects && currentInsight.positive_aspects.length > 0 ? (
                      currentInsight.positive_aspects.map((aspect, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 border-l-4 border-green-200 bg-green-50 rounded-r-lg">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{aspect}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No specific positive aspects identified</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Items */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-500" />
                    Recommended Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentInsight.top_insights && currentInsight.top_insights.length > 0 ? (
                      currentInsight.top_insights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 border-l-4 border-blue-200 bg-blue-50 rounded-r-lg">
                          <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-gray-700">{insight}</p>
                            <div className="mt-2 flex gap-2">
                              <Badge variant="outline" className="text-xs">AI Insight</Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No specific insights available</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Topic Performance */}
              {currentInsight.topic_sentiment_map && (
                <Card>
                  <CardHeader>
                    <CardTitle>Topic Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(currentInsight.topic_sentiment_map).map(([topic, performance]) => (
                        <div key={topic} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{topic}</p>
                            <p className="text-sm text-gray-500">
                              +{performance.positive_count} positive, -{performance.negative_count} negative
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${getSentimentColor(performance.avg_rating >= 3.5 ? 'positive' : performance.avg_rating >= 2.5 ? 'mixed' : 'negative')}`}>
                              {performance.avg_rating?.toFixed(1)}
                            </p>
                            <p className="text-sm text-gray-500">avg rating</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InsightsSection;
