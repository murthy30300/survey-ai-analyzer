
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, CheckCircle } from "lucide-react";
import { InsightData } from "@/hooks/useInsightsData";

interface PositiveTabProps {
  currentInsight: InsightData;
  exportMode: boolean;
}

const PositiveTab = ({ currentInsight, exportMode }: PositiveTabProps) => {
  return (
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
        <ScrollArea className={exportMode ? "" : "h-96"}>
          <div className="space-y-3">
            {currentInsight.positive_aspects?.length ? (
              currentInsight.positive_aspects.map((aspect, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-r-lg border-l-4 border-green-200 bg-green-50 p-4"
                >
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                  <p className="text-gray-700">{aspect}</p>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-gray-500">
                No specific positive aspects identified
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PositiveTab;
