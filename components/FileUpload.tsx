
import React, { useState, useCallback } from 'react';
import { FileAttachment } from '../types';
import { Upload, X, File as FileIcon, Paperclip } from 'lucide-react';

interface FileUploadProps {
  files: FileAttachment[];
  onFilesChange: (files: FileAttachment[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ files, onFilesChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const processFiles = (fileList: File[]) => {
    const newFiles: FileAttachment[] = [...files];
    let filesToProcess = fileList.length;

    if (filesToProcess === 0) return;

    fileList.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        newFiles.push({
          name: file.name,
          url: reader.result as string,
          type: file.type,
        });
        filesToProcess--;
        if (filesToProcess === 0) {
          onFilesChange(newFiles);
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        filesToProcess--;
        if (filesToProcess === 0) {
          onFilesChange(newFiles);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-sky-50' : 'border-gray-300 hover:border-primary'}`}
      >
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="flex flex-col items-center space-y-2 cursor-pointer">
          <Upload className="w-10 h-10 text-gray-400" />
          <span className="text-sm font-medium text-textPrimary">
            Drag & drop files here, or{' '}
            <span className="text-primary">browse</span>
          </span>
          <span className="text-xs text-textSecondary">Max file size 10MB</span>
        </label>
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
           <h4 className="text-sm font-medium text-textPrimary flex items-center"><Paperclip size={16} className="mr-2"/> Attached Files</h4>
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  {file.type.startsWith('image/') ? (
                    <img src={file.url} alt={file.name} className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded">
                      <FileIcon className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <span className="text-sm text-textPrimary truncate" title={file.name}>{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 rounded-full text-textSecondary hover:bg-red-100 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
