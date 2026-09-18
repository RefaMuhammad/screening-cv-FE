import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import JobRequirementForm from './components/JobRequirementForm';
import CvUploader from './components/CvUploader';
import ScreeningResults from './components/ScreeningResults';
import { JobRequirement, ScreeningResponse } from './types';
import { screenBatch, checkOcrStatus } from './services/api';
import { Loader2 } from 'lucide-react';

function App() {
  const [jobReq, setJobReq] = useState<JobRequirement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ScreeningResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ocrStatus, setOcrStatus] = useState<any>(null);

  useEffect(() => {
    checkOcrStatus().then(setOcrStatus).catch(console.error);
  }, []);

  const handleStartMatch = async () => {
    if (!jobReq) {
      setError("Please complete the job requirement form.");
      return;
    }
    if (files.length === 0) {
      setError("Please upload at least one CV.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResults(null);

    try {
      const response = await screenBatch(jobReq, files);
      setResults(response);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "An error occurred during processing");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout ocrStatus={ocrStatus}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {!results && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <JobRequirementForm onChange={setJobReq} />
            </div>
            
            <div className="space-y-6">
              <CvUploader files={files} setFiles={setFiles} />
              
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <button
                  onClick={handleStartMatch}
                  disabled={isProcessing || !jobReq || files.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 flex items-center justify-center transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Processing {files.length} CVs...
                    </>
                  ) : (
                    "Submit Requirement & Start AI Match"
                  )}
                </button>
                {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
              </div>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Screening Results for {results.job_title}</h2>
              <button 
                onClick={() => setResults(null)}
                className="text-blue-600 hover:underline"
              >
                Start New Screening
              </button>
            </div>
            <ScreeningResults results={results.results} />
          </div>
        )}

      </div>
    </Layout>
  );
}

export default App;
