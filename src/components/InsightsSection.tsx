
import { useState } from 'react';
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
  BarChart3
} from "lucide-react";

interface InsightsSectionProps {
  userId: string | null;
}

const InsightsSection = ({ userId }: InsightsSectionProps) => {
  const [selectedSurvey, setSelectedSurvey] = useState('data-structures');

  // Mock data for different surveys
  const surveyData = {
    'data-structures': {
      title: 'Data Structures Course Feedback',
      date: '2024-01-15',
      responses: 287,
      summary: {
        overall: 'Students show strong engagement with the course material, particularly appreciating the practical coding exercises. However, there are concerns about the pace of certain topics and the need for more real-world examples.',
        satisfaction: 4.2,
        sentiment: 'positive'
      },
      painPoints: [
        'Course moves too fast during advanced tree algorithms (mentioned by 45% of students)',
        'Need more practice problems for dynamic programming concepts',
        'Lab sessions could be longer to complete assignments',
        'Some students struggle with recursion concepts'
      ],
      positiveAspects: [
        'Excellent use of visual diagrams to explain complex data structures',
        'Coding assignments are well-designed and challenging',
        'Professor is very approachable and helpful during office hours',
        'Good balance between theory and practical implementation'
      ],
      actionItems: [
        'Slow down the pace for tree algorithms - consider splitting into 2 lectures',
        'Add 5-7 more dynamic programming practice problems to the course material',
        'Extend lab session duration from 2 to 3 hours',
        'Create additional recursion tutorial videos with step-by-step examples'
      ],
      topics: [
        { name: 'Arrays & Linked Lists', satisfaction: 4.5, difficulty: 'Easy' },
        { name: 'Stacks & Queues', satisfaction: 4.3, difficulty: 'Easy' },
        { name: 'Trees & Binary Search', satisfaction: 3.8, difficulty: 'Medium' },
        { name: 'Graph Algorithms', satisfaction: 3.5, difficulty: 'Hard' },
        { name: 'Dynamic Programming', satisfaction: 3.2, difficulty: 'Hard' }
      ]
    },
    'algorithms': {
      title: 'Algorithm Design Course Feedback',
      date: '2024-01-20',
      responses: 312,
      summary: {
        overall: 'Mixed feedback on the algorithms course. Students appreciate the theoretical depth but struggle with the mathematical complexity. More practical examples would help bridge the gap between theory and application.',
        satisfaction: 3.8,
        sentiment: 'mixed'
      },
      painPoints: [
        'Too much mathematical notation without sufficient explanation',
        'Lack of coding implementation for theoretical algorithms',
        'Assignments are too theoretical and disconnected from practice',
        'Need more time to understand complexity analysis'
      ],
      positiveAspects: [
        'Strong theoretical foundation provided',
        'Professor has deep knowledge of the subject',
        'Good coverage of classical algorithms',
        'Textbook recommendations are excellent'
      ],
      actionItems: [
        'Include coding implementations for all major algorithms',
        'Simplify mathematical notation and provide more intuitive explanations',
        'Add practical programming assignments alongside theoretical ones',
        'Dedicate more time to complexity analysis with step-by-step examples'
      ],
      topics: [
        { name: 'Sorting Algorithms', satisfaction: 4.1, difficulty: 'Easy' },
        { name: 'Graph Algorithms', satisfaction: 3.6, difficulty: 'Medium' },
        { name: 'Dynamic Programming', satisfaction: 3.2, difficulty: 'Hard' },
        { name: 'Greedy Algorithms', satisfaction: 3.9, difficulty: 'Medium' },
        { name: 'Complexity Analysis', satisfaction: 2.8, difficulty: 'Hard' }
      ]
    }
  };

  const availableSurveys = [
    { id: 'data-structures', name: 'Data Structures', date: '2024-01-15', responses: 287, status: 'completed' },
    { id: 'algorithms', name: 'Algorithm Design', date: '2024-01-20', responses: 312, status: 'completed' },
    { id: 'database', name: 'Database Systems', date: '2024-01-25', responses: 298, status: 'processing' },
    { id: 'software-eng', name: 'Software Engineering', date: '2024-01-30', responses: 275, status: 'completed' }
  ];

  const currentData = surveyData[selectedSurvey as keyof typeof surveyData];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSatisfactionColor = (score: number) => {
    if (score >= 4.0) return 'text-green-600';
    if (score >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {availableSurveys.map((survey) => (
              <button
                key={survey.id}
                onClick={() => setSelectedSurvey(survey.id)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedSurvey === survey.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{survey.name}</h3>
                    <Badge 
                      variant="secondary" 
                      className={survey.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                    >
                      {survey.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{survey.date}</p>
                  <p className="text-sm text-gray-600">{survey.responses} responses</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Insights */}
      {currentData && (
        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{currentData.title}</CardTitle>
                  <CardDescription>
                    Analysis completed on {currentData.date} • {currentData.responses} responses
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{currentData.summary.satisfaction}</div>
                  <div className="text-sm text-gray-600">Overall Satisfaction</div>
                  <div className="text-xs text-gray-500">out of 5.0</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{currentData.responses}</div>
                  <div className="text-sm text-gray-600">Total Responses</div>
                  <div className="text-xs text-gray-500">87% response rate</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold capitalize ${
                    currentData.summary.sentiment === 'positive' ? 'text-green-600' : 
                    currentData.summary.sentiment === 'mixed' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {currentData.summary.sentiment}
                  </div>
                  <div className="text-sm text-gray-600">Overall Sentiment</div>
                  <div className="text-xs text-gray-500">AI-powered analysis</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="pain-points">Pain Points</TabsTrigger>
              <TabsTrigger value="positive">Positive Aspects</TabsTrigger>
              <TabsTrigger value="actions">Action Items</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    AI-Generated Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{currentData.summary.overall}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Topic Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentData.topics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-gray-900">{topic.name}</p>
                            <Badge variant="secondary" className={getDifficultyColor(topic.difficulty)}>
                              {topic.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getSatisfactionColor(topic.satisfaction)}`}>
                            {topic.satisfaction}
                          </p>
                          <p className="text-sm text-gray-500">satisfaction</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pain-points">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Areas for Improvement
                  </CardTitle>
                  <CardDescription>
                    Key challenges identified from student feedback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {currentData.painPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 border-l-4 border-red-200 bg-red-50 rounded-r-lg">
                          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{point}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="positive">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                    What's Working Well
                  </CardTitle>
                  <CardDescription>
                    Strengths highlighted by students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {currentData.positiveAspects.map((aspect, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 border-l-4 border-green-200 bg-green-50 rounded-r-lg">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{aspect}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-500" />
                    Recommended Actions
                  </CardTitle>
                  <CardDescription>
                    AI-generated recommendations based on feedback analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {currentData.actionItems.map((action, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 border-l-4 border-blue-200 bg-blue-50 rounded-r-lg">
                          <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-gray-700">{action}</p>
                            <div className="mt-2 flex gap-2">
                              <Badge variant="outline" className="text-xs">High Priority</Badge>
                              <Badge variant="outline" className="text-xs">Quick Win</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default InsightsSection;
