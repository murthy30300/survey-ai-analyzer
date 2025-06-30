
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { InsightData } from "@/hooks/useInsightsData";

interface SummaryTabProps {
  currentInsight: InsightData;
}

const getSentimentColor = (sentiment: string) => {
  switch ((sentiment || "").toLowerCase()) {
    case "positive":
      return "text-green-600";
    case "mixed":
    case "neutral":
      return "text-yellow-600";
    case "negative":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const SummaryTab = ({ currentInsight }: SummaryTabProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Analysis Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h4 className="mb-2 font-semibold">Key Metrics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                Average Satisfaction:{" "}
                {currentInsight.avg_satisfaction?.toFixed(1)}/5.0
              </div>
              <div>
                Response Count: {currentInsight.response_count}
              </div>
              <div>
                Overall Sentiment:{" "}
                {currentInsight.overall_sentiment}
              </div>
              <div>
                Completed Analyses:{" "}
                {currentInsight.completed_analyses}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentInsight.topic_sentiment_map && (
        <Card>
          <CardHeader>
            <CardTitle>Topic Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(currentInsight.topic_sentiment_map).map(([topic, perf]) => (
                <div
                  key={topic}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {topic}
                    </p>
                    <p className="text-sm text-gray-500">
                      +{perf.positive_count} positive,&nbsp;-
                      {perf.negative_count} negative
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${getSentimentColor(
                        perf.avg_rating >= 3.5
                          ? "positive"
                          : perf.avg_rating >= 2.5
                          ? "mixed"
                          : "negative"
                      )}`}
                    >
                      {perf.avg_rating?.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-500">
                      avg rating
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SummaryTab;
