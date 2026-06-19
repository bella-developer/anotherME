import { useState, useRef } from 'react';
import { FaImage, FaTimes } from 'react-icons/fa';

/**
 * ImageUpload Component
 * Compact image upload with drag & drop and preview
 */
const ImageUpload = ({ onImageSelect, onImageRemove, disabled = false }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    if (!file) return false;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return false;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return false;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFileName(file.name);
      onImageSelect(file);
    };
    reader.readAsDataURL(file);
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndProcessFile(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging false if leaving the main container
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemove();
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {!preview ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="w-full py-3 px-4 border border-dashed transition-all duration-200 cursor-pointer"
          style={{
            borderColor: isDragging ? 'rgba(161, 98, 7, 0.6)' : 'rgba(255,255,255,0.15)',
            background: isDragging ? 'rgba(161, 98, 7, 0.1)' : 'rgba(255,255,255,0.02)',
            borderRadius: '3px',
            opacity: disabled ? 0.5 : 1,
            pointerEvents: disabled ? 'none' : 'auto',
          }}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <FaImage 
              className="transition-colors" 
              style={{ color: isDragging ? 'rgba(161, 98, 7, 0.8)' : 'rgba(161, 98, 7, 0.5)' }}
              size={16} 
            />
            <div className="text-center">
              <span 
                className="text-xs font-light tracking-wide block"
                style={{ color: isDragging ? 'rgba(161, 98, 7, 0.9)' : 'rgba(161, 98, 7, 0.7)' }}
              >
                {isDragging ? 'Drop your image here' : 'Add image (optional)'}
              </span>
              {!isDragging && (
                <span className="text-white/30 text-[10px] block mt-1">
                  Click or drag & drop • Max 5MB
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex items-center gap-2 p-2 border border-white/10 rounded bg-white/5">
          {/* Small preview thumbnail */}
          <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded border border-white/20">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* File name */}
          <div className="flex-1 min-w-0">
            <span className="text-white/60 text-xs block truncate">
              {fileName}
            </span>
            <span className="text-white/30 text-[10px]">
              Image attached
            </span>
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              background: 'rgba(220, 38, 38, 0.8)',
            }}
          >
            <FaTimes className="text-white" size={10} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
