import React from 'react';
import { Activity } from 'lucide-react';

export default function Layout({ children, ocrStatus }: { children: React.ReactNode, ocrStatus: any }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              WINMAKER <span className="font-light text-gray-500">ATS ENTERPRISE</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            {ocrStatus && (
              <span className={`px-2 py-1 rounded-full ${ocrStatus.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} flex items-center`}>
                <Activity className="w-3 h-3 mr-1" />
                OCR: {ocrStatus.device?.toUpperCase() || 'OFF'}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Vacancy Intake</h2>
            <p className="text-sm text-gray-500">Draft #REQ-8842</p>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
