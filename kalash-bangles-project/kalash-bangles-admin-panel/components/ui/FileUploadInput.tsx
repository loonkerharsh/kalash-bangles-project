
import React, { useState, useEffect } from 'react';

interface FileUploadInputProps {
  id: string;
  label?: string;
  onChange: (file: File | null) => void;
  accept?: string;
  currentImageUrl?: string; // URL of currently saved image
  containerClassName?: string;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({ id, label, onChange, accept = "image/*", currentImageUrl, containerClassName = '' }) => {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange(file);
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName(null);
      setPreview(currentImageUrl || null); // Revert to current image if file selection is cancelled
    }
  };

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="mt-1 flex items-center space-x-4">
        {preview && (
          <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded-md shadow-sm" />
        )}
        <div className="flex flex-col">
          <input
            type="file"
            id={id}
            accept={accept}
            onChange={handleFileChange}
            className="hidden" 
          />
          <label
            htmlFor={id}
            className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            {fileName ? 'Change file' : 'Upload file'}
          </label>
          {fileName && <span className="text-xs text-gray-500 mt-1">{fileName}</span>}
          {!fileName && currentImageUrl && <span className="text-xs text-gray-500 mt-1">Current image set. Upload to change.</span>}
        </div>
      </div>
    </div>
  );
};

export default FileUploadInput;
