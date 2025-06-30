
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb } from "lucide-react";
import { InsightData } from "@/hooks/useInsightsData";

interface ActionsTabProps {
  currentInsight: InsightData;
  exportMode: boolean;
}

const ActionsTab = ({ currentInsight, exportMode }: ActionsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-blue-500" />
          Recommended Actions
        </CardTitle>
        <CardDescription>
          AI‑generated recommendations based on feedback analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className={exportMode ? "" : "h-96"}>
          <div className="space-y-3">
            {currentInsight.top_insights?.length ? (
              currentInsight.top_insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-r-lg border-l-4 border-blue-200 bg-blue-50 p-4"
                >
                  <Lightbulb className="h-5 w-5 flex-shrink-0 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-gray-700">{insight}</p>
                    <div className="mt-2 flex gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        AI Insight
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-gray-500">
                No specific insights available
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActionsTab;
