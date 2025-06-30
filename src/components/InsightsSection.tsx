
import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useInsightsData } from '@/hooks/useInsightsData';
import SurveySelector from './insights/SurveySelector';
import OverviewCard from './insights/OverviewCard';
import SummaryTab from './insights/SummaryTab';
import PainPointsTab from './insights/PainPointsTab';
import PositiveTab from './insights/PositiveTab';
import ActionsTab from './insights/ActionsTab';

interface InsightsSectionProps {
  userId: string | null;
}

const InsightsSection = ({ userId }: InsightsSectionProps) => {
  const { surveyHistory, insights, loading, refetchData } = useInsightsData(userId);
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  // Poll for status updates
  useEffect(() => {
    if (polling && selectedSurvey && userId) {
      const interval = setInterval(() => {
        refetchData();
        const survey = surveyHistory.find(s => s.upload_id === selectedSurvey);
        if (survey && survey.status === 'analyzed') {
          setPolling(false);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [polling, selectedSurvey, userId, surveyHistory, refetchData]);

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

  const getCurrentInsight = () => {
    if (!selectedSurvey) return null;
    return insights.find(i => i.upload_id === selectedSurvey) || null;
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
      <SurveySelector 
        surveyHistory={surveyHistory}
        selectedSurvey={selectedSurvey}
        onSurveySelect={handleSurveySelect}
        polling={polling}
      />

      {selectedSurvey && currentSurvey && (
        <div ref={pdfRef} className="space-y-6 pdf-content">
          <OverviewCard 
            selectedSurvey={selectedSurvey}
            currentSurvey={currentSurvey}
            currentInsight={currentInsight}
            onExportPDF={handleExportPDF}
          />

          {currentInsight && (
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="pain-points">Pain Points</TabsTrigger>
                <TabsTrigger value="positive">Positive Aspects</TabsTrigger>
                <TabsTrigger value="actions">Action Items</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <SummaryTab currentInsight={currentInsight} />
              </TabsContent>

              <TabsContent value="pain-points">
                <PainPointsTab currentInsight={currentInsight} exportMode={exportLoading} />
              </TabsContent>

              <TabsContent value="positive">
                <PositiveTab currentInsight={currentInsight} exportMode={exportLoading} />
              </TabsContent>

              <TabsContent value="actions">
                <ActionsTab currentInsight={currentInsight} exportMode={exportLoading} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      )}
    </div>
  );
};

export default InsightsSection;
