
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface UploadSectionProps {
  userId: string | null;
}

interface UploadRecord {
  id: string;
  filename: string;
  status: 'uploading' | 'raw' | 'processing' | 'preprocessed' | 'analyzed' | 'completed' | 'error';
  timestamp: string;
  progress: number;
}

const UploadSection = ({ userId }: UploadSectionProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        toast.error('Please select a CSV file');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const simulateUploadProgress = async (uploadId: string) => {
    const stages = [
      { status: 'uploading' as const, progress: 25, duration: 1000 },
      { status: 'raw' as const, progress: 40, duration: 800 },
      { status: 'processing' as const, progress: 60, duration: 2000 },
      { status: 'preprocessed' as const, progress: 80, duration: 1500 },
      { status: 'analyzed' as const, progress: 95, duration: 1000 },
      { status: 'completed' as const, progress: 100, duration: 500 },
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, stage.duration));
      setUploads(prev => prev.map(upload => 
        upload.id === uploadId 
          ? { ...upload, status: stage.status, progress: stage.progress }
          : upload
      ));
      setUploadProgress(stage.progress);
    }
    
    toast.success('Survey analysis completed!');
    setIsUploading(false);
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) return;

    const uploadId = `upload_${Date.now()}`;
    const newUpload: UploadRecord = {
      id: uploadId,
      filename: selectedFile.name,
      status: 'uploading',
      timestamp: new Date().toLocaleString(),
      progress: 0
    };

    setUploads(prev => [newUpload, ...prev]);
    setIsUploading(true);
    toast.success('Upload started!');

    // Simulate the upload and processing pipeline
    simulateUploadProgress(uploadId);
  };

  const getStatusIcon = (status: UploadRecord['status']) => {
    switch (status) {
      case 'uploading':
      case 'raw':
      case 'processing':
      case 'preprocessed':
      case 'analyzed':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: UploadRecord['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'uploading':
      case 'processing':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Survey Data
          </CardTitle>
          <CardDescription>
            Upload CSV files containing student survey responses for analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drag and drop your CSV file here
                </p>
                <p className="text-gray-500">or click to browse</p>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </div>

          {selectedFile && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isUploading ? 'Processing...' : 'Start Analysis'}
                  </Button>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing survey data...</span>
                    <span className="text-gray-900">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload History */}
      {uploads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
            <CardDescription>
              Track the progress of your survey analyses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploads.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(upload.status)}
                    <div>
                      <p className="font-medium text-gray-900">{upload.filename}</p>
                      <p className="text-sm text-gray-500">{upload.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium capitalize ${getStatusColor(upload.status)}`}>
                      {upload.status}
                    </p>
                    <div className="w-24 mt-1">
                      <Progress value={upload.progress} className="h-2" />
                    </div>
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

export default UploadSection;
