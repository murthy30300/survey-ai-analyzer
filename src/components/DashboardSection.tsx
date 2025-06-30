
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Users, FileText, Clock, CheckCircle } from "lucide-react";

interface DashboardSectionProps {
  userId: string | null;
}

const DashboardSection = ({ userId }: DashboardSectionProps) => {
  // Mock data for demonstration
  const stats = {
    totalSurveys: 12,
    totalResponses: 3247,
    completedAnalyses: 8,
    averageSatisfaction: 4.2,
  };

  const recentActivity = [
    { id: 1, action: 'Survey analyzed', course: 'Data Structures', responses: 287, time: '2 hours ago', status: 'completed' },
    { id: 2, action: 'Processing started', course: 'Algorithm Design', responses: 312, time: '4 hours ago', status: 'processing' },
    { id: 3, action: 'Survey uploaded', course: 'Database Systems', responses: 298, time: '1 day ago', status: 'uploaded' },
    { id: 4, action: 'Report generated', course: 'Software Engineering', responses: 275, time: '2 days ago', status: 'completed' },
  ];

  const courseInsights = [
    { course: 'Data Structures', satisfaction: 4.5, responses: 287, sentiment: 'positive', trend: 'up' },
    { course: 'Algorithm Design', satisfaction: 3.8, responses: 312, sentiment: 'mixed', trend: 'down' },
    { course: 'Database Systems', satisfaction: 4.2, responses: 298, sentiment: 'positive', trend: 'up' },
    { course: 'Software Engineering', satisfaction: 4.0, responses: 275, sentiment: 'positive', trend: 'neutral' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'uploaded':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'mixed':
        return 'text-yellow-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded-full" />;
    }
  };

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
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {activity.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : activity.status === 'processing' ? (
                      <Clock className="h-5 w-5 text-blue-500" />
                    ) : (
                      <FileText className="h-5 w-5 text-gray-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.course} • {activity.responses} responses</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Course Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>Satisfaction scores and sentiment analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseInsights.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{course.course}</span>
                      {getTrendIcon(course.trend)}
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">{course.satisfaction}</span>
                      <span className="text-sm text-gray-500">/5.0</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`capitalize ${getSentimentColor(course.sentiment)}`}>
                      {course.sentiment} sentiment
                    </span>
                    <span className="text-gray-500">{course.responses} responses</span>
                  </div>
                  <Progress value={(course.satisfaction / 5) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSection;
