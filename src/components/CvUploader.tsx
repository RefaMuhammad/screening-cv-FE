import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X } from 'lucide-react';

interface Props {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function CvUploader({ files, setFiles }: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, [setFiles]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    }
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h3 className="text-lg font-semibold border-b pb-2 mb-4 uppercase tracking-wider text-gray-700">Upload CVs</h3>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-sm text-gray-600">
          {isDragActive ? "Drop the PDF files here..." : "Drag 'n' drop CV files here, or click to select"}
        </p>
        <p className="text-xs text-gray-400 mt-2">Only PDF files are supported in this POC</p>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Files ({files.length})</h4>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {files.map((file, idx) => (
              <li key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                <div className="flex items-center overflow-hidden">
                  <FileText className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
