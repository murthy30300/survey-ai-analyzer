
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle } from "lucide-react";
import { InsightData } from "@/hooks/useInsightsData";

interface PainPointsTabProps {
  currentInsight: InsightData;
  exportMode: boolean;
}

const PainPointsTab = ({ currentInsight, exportMode }: PainPointsTabProps) => {
  return (
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
        <ScrollArea className={exportMode ? "" : "h-96"}>
          <div className="space-y-3">
            {currentInsight.pain_points?.length ? (
              currentInsight.pain_points.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-r-lg border-l-4 border-red-200 bg-red-50 p-4"
                >
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" />
                  <p className="text-gray-700">{point}</p>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-gray-500">
                No specific pain points identified
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PainPointsTab;
