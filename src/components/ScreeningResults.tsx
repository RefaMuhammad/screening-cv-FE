import React, { useState } from 'react';
import { Gate1Result, Gate1Criteria } from '../types';
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight, FileText } from 'lucide-react';

export default function ScreeningResults({ results }: { results: Gate1Result[] }) {
  const [selectedResult, setSelectedResult] = useState<Gate1Result | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);

  const getStatusIcon = (status: string) => {
    if (status === 'PASS') return <CheckCircle2 className="text-green-500 w-5 h-5" />;
    if (status === 'FAIL') return <XCircle className="text-red-500 w-5 h-5" />;
    return <AlertTriangle className="text-yellow-500 w-5 h-5" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'PASS') return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">PASS</span>;
    if (status === 'FAIL') return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-bold">FAIL</span>;
    if (status === 'ERROR') return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-bold">ERROR</span>;
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold">REVIEW</span>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* List */}
      <div className="col-span-1 bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-700">Candidates</h3>
        </div>
        <div className="overflow-y-auto flex-1">
          <ul className="divide-y divide-gray-100">
            {results.map((res, idx) => (
              <li 
                key={idx} 
                className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-between ${selectedResult === res ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                onClick={() => { setSelectedResult(res); setShowEvidence(false); }}
              >
                <div>
                  <p className="font-medium text-sm text-gray-900">{res.candidate_name}</p>
                  <p className="text-xs text-gray-500 truncate w-40">{res.filename}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(res.status)}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Details */}
      <div className="col-span-2 bg-white rounded-lg shadow border border-gray-200 p-6 h-[600px] overflow-y-auto">
        {selectedResult ? (
          <div>
            <div className="flex justify-between items-start mb-6 border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedResult.candidate_name}</h2>
                <p className="text-gray-500">{selectedResult.filename}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Gate 1 Overall</p>
                {getStatusBadge(selectedResult.status)}
              </div>
            </div>

            {selectedResult.status === 'ERROR' ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-md">
                <p className="font-bold">Processing Error</p>
                <p className="text-sm mt-1">{selectedResult.overall_reason}</p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Criteria Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {(Object.keys(selectedResult.criteria) as Array<keyof Gate1Criteria>).map((key) => {
                    const crit = selectedResult.criteria[key];
                    return (
                      <div key={key} className="border rounded-lg p-4 bg-gray-50 flex items-start space-x-4">
                        <div className="mt-1">{getStatusIcon(crit.status)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-800 capitalize">{key}</h4>
                            {getStatusBadge(crit.status)}
                          </div>
                          
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-bold">Required</p>
                              <p className="text-gray-900">{crit.required}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-bold">Candidate</p>
                              <p className="text-gray-900">{crit.actual}</p>
                            </div>
                          </div>
                          
                          <p className="mt-2 text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                            <span className="font-medium">AI Reasoning:</span> {crit.reason}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-blue-50 text-blue-900 p-4 rounded-md border border-blue-100">
                  <h4 className="font-bold text-sm uppercase">AI Summary</h4>
                  <p className="text-sm mt-1">{selectedResult.overall_reason}</p>
                </div>

                <div className="pt-4 border-t">
                  <button 
                    onClick={() => setShowEvidence(!showEvidence)}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {showEvidence ? 'Hide CV Evidence' : 'View CV Evidence'}
                  </button>

                  {showEvidence && (
                    <div className="mt-4 space-y-2">
                      {selectedResult.evidence_snippets.length > 0 ? (
                        selectedResult.evidence_snippets.map((snippet, idx) => (
                          <blockquote key={idx} className="border-l-4 border-gray-300 pl-4 py-1 text-sm text-gray-600 bg-gray-50 italic">
                            "{snippet}"
                          </blockquote>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No specific evidence snippets extracted.</p>
                      )}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p>Select a candidate to view screening details</p>
          </div>
        )}
      </div>

    </div>
  );
}
