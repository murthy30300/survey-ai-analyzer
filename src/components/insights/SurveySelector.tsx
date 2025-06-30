
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { SurveyData } from "@/hooks/useInsightsData";

interface SurveySelectorProps {
  surveyHistory: SurveyData[];
  selectedSurvey: string | null;
  onSurveySelect: (uploadId: string) => void;
  polling: boolean;
}

const SurveySelector = ({ surveyHistory, selectedSurvey, onSurveySelect, polling }: SurveySelectorProps) => {
  return (
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
          <p className="py-4 text-center text-gray-500">
            No surveys uploaded yet
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {surveyHistory.map((survey) => (
              <button
                key={survey.upload_id}
                onClick={() => onSurveySelect(survey.upload_id)}
                className={`transition-colors rounded-lg border p-4 text-left ${
                  selectedSurvey === survey.upload_id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      Survey {survey.upload_id}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={
                        survey.status === "analyzed"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {survey.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {survey.timestamp}
                  </p>
                  {polling && selectedSurvey === survey.upload_id && (
                    <p className="text-xs text-blue-600">
                      Checking status…
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SurveySelector;
