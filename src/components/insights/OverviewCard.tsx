
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Clock } from "lucide-react";
import { InsightData, SurveyData } from "@/hooks/useInsightsData";

interface OverviewCardProps {
  selectedSurvey: string;
  currentSurvey: SurveyData;
  currentInsight: InsightData | null;
  onExportPDF: () => void;
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

const OverviewCard = ({ selectedSurvey, currentSurvey, currentInsight, onExportPDF }: OverviewCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Survey {selectedSurvey} Analysis</CardTitle>
            <CardDescription>
              {currentSurvey.status === "analyzed"
                ? "Analysis completed"
                : "Processing in progress"}{" "}
              • Uploaded on {currentSurvey.timestamp}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={!currentInsight}
            onClick={onExportPDF}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {currentInsight ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {currentInsight.avg_satisfaction?.toFixed(1) ?? "N/A"}
              </div>
              <div className="text-sm text-gray-600">
                Overall Satisfaction
              </div>
              <div className="text-xs text-gray-500">out of 5.0</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {currentInsight.response_count || 0}
              </div>
              <div className="text-sm text-gray-600">
                Total Responses
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-3xl font-bold capitalize ${getSentimentColor(
                  currentInsight.overall_sentiment
                )}`}
              >
                {currentInsight.overall_sentiment || "Unknown"}
              </div>
              <div className="text-sm text-gray-600">
                Overall Sentiment
              </div>
              <div className="text-xs text-gray-500">
                AI‑powered analysis
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <Clock className="mx-auto h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-2 text-gray-600">
              {currentSurvey.status === "analyzed"
                ? "Loading insights…"
                : "Analysis in progress…"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
